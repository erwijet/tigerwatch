
# TigerWatch

[![Netlify Status](https://api.netlify.com/api/v1/badges/c5558385-9418-4ee3-8a0f-aa65e4083869/deploy-status)](https://app.netlify.com/sites/distracted-pare-04fe9c/deploys)

An easy way for RIT students to track and monitor dining dollar spending

**NOTE**: Users will need an RIT Computer account to access tigerwatch because it pulls data from RIT's tigerspend.rit.edu platform. 

## Project Structure

|Name|Description|
|---|---|
|rattman|The React PWA client|
|caroline|The tigerspend.rit.edu interop server written in elixir|
|cavej|Type declarations for tigerwatch transaction data|
|chell|A collection of useful dev tools, written in rust|

tigerwatch is available as a progressive web app at [tigerwatch.app](https://tigerwatch.app)

## Motivation
Logging in to check your dining dollar balance is a *royal* pain. Not only is tigerspend.rit.edu hot trash on mobile, but there are *so* many buttons to click. Plus, its an entire website you have to navigate to. It is the reason you have a banking **app** on your phone instead of just using the banking website on your mobile browser.

Also, ITS laughed at my request to gain shibboleth access even though I *work for them*, so this was my successful attempt to utilize the features of Shibboleth SAML without actually having a registered SAML client; we just piggyback off of tigerspend.

## Future Plans

If you check out the production enviorment, you will notice that it looks rather not-great on desktop. I am not a UX designer by any means, but I am slowly working on implemented features. Feel free to add to this list of features or open an issue :D

- [ ] D3 graph integration
	- [ ] Activity by time
	- [ ] Activity by location
- [ ] Actally get NavBar widgets to do something
	- [ ] Search bar to search transactions
	- [X] Refresh button to refresh spending data
	- [ ] Account button? 
- [ ] Add some sort of drop down to toggle between accounts (dining dollars / tigerbucks, etc).
    - [X] Possible aggregation of *all* accounts into one account, where each transaction has an attached account?

## The Nuts, Bolts, and Magic

### Fetching from tigerspend.rit.edu

"But how does it work??" I am so glad you asked.

Here is some precursor information about how data is accessed at tigerspend.rit.edu (not to be confused with tiger**watch**).

Spending data is avalible in CSV format at `tigerspend.rit.edu/statementdetail.php` with the following URL parameters:

   |parameter|description|
   |---|---|
   |skey|The session ID representing the user's session|
   |cid|Not 100% sure, but it is fixed at 105. My guess is that RIT licences this software and it is an identifier that this an an RIT domain request|
   |startDate|The **oldest** point in time to fetch data from. This is of the format YYYY-MM-DD|
   |endDate|The **newest** point in time to fetch data from. This is of the format YYYY-MM-DD|
   |acct|The account code. This is the flag that determines if Dining Dollars, Voluntary Dining Dollars, or Tiger Bucks are returned|
   |format|Self-explanatory. We keep this fixed as `csv`|
   
More specifically, the acct codes are as follows:
|acct code|account description|
|---|---|
|4|Dining Dollars|
|24|Voluntary Dining Dollars|
|29|Rollover Dining Dollars|
|1|Tiger Bucks|


So, how do we get an `skey` value? `skey`s are administered by the `tigerspend.rit.edu/login.php` endpoint. This endpoint takes the following parameters:
|parameter|description|
|---|---|
|skey|The session ID respresenting the users' session|
|wason|The link to redirect the user to after logging in|

If the skey is blank or invalid, one will attempted to be generated and appended to the url before redirecting to the path specified by `wason`. This is done by checking the value of the `SHIBSESSION` cookie in the header of the request. Now, if the user has already logged into something else with shibboleth then we *might* have a shot in the dark of having this cookie already set. But most likely it will either be missing or invalid. If this is the case (missing or invalid `SHIBSESSION`) the user will *first* be redirected to the Shibboleth login page for tigerspend, and then redirected to the `wason` after they have signed in.

What this means is that if we can point that `wason` to a callback endpoint that we host, we can read and store the skey to make as many attempts as we want before the `skey` is expired, and we generate a new one again. The issue arises, however, the client will not be making a request to tigerspend in their browser, our server will be making the request. This raises the question of how will the user ever see the sign in page? This is how the flow of our server is constructed.

### Data flow from Tigerspend to Tigerwatch

When unauthenticated:

1. `tigerwatch.app` -GET-> `api.tigerwatch.app/data`
2. `api.tigerwatch.app/data` -302-> `api.tigerwatch.app/data/<skey>` where `<skey>` is pulled from the request cookies.
3. `api.tigerwatch.app/data/<skey>` -GET-> `tigerspend.rit.edu/statmentdetail?skey=<skey>`
4. `tigerspend.rit.edu/statmentdetail?skey=<skey>` -302-> `tigerspend.rit.edu/login.php?wason=/statementdetail`
5. `tigerwatch.app` <-401- `api.tigerwatch.app/data/<skey>`

Tigerspend 302's request to shib server for authentication, which the server then tells the client by responding with `401`. The reason we don't just follow this shib redirect is because `tigerspend.rit.edu/statementdetail` sets the `wason` of the shib auth to `/statmentdetail`, which means we will not be able to capture it for future use. Instead, we employ our own authentication routine:

1. `tigerwatch.app` navigates to `api.tigerwatch.app/auth`
2. `api.tigerwatch.app/auth` -302-> `tigerspend.rit.edu/login?wason=api.tigerwatch.app/callback`
3. `tigerspend.rit.edu/login?wason=api.tigerwatch.app/callback` -302-> `shibboleth.main.ad.rit.edu/idp/profile/SAML2/Redirect/SSO?execution=e1s2`
4. *user authenticates with Shibboleth*
5. `shibboleth.main.ad.rit` -302-> `api.tigerwatch.app/callback?skey=<skey>` where `<skey>` is the new and valid skey
6. `api.tigerwatch.app/callback` sets `skey` as a cookie on all `*.tigerwatch.app` subdomains and then redirects back to `tigerwatch.app`

Tigerwatch is now reloaded, and begins its data fetch routine again. This time, with a valid `skey`:

1. `tigerwatch.app` -GET-> `api.tigerwatch.app/data`
2. `api.tigerwatch.app/data` -302-> `api.tigerwatch.app/data/<skey>`
3. `api.tigerwatch.app/data/<skey>` -GET-> `tigerspend.rit.edu/statmentdetail?skey=<skey>`
4. `api.tigerwatcg.app/data<skey>` <-200- **Raw CSV Spending Data**
5. api.tigerwatch.app matches and formats against locationspec file, `locations.json` (see below in 'data transformation'), and converts to JSON
6. `tigerwatch.app` <-200- **The relevent, JSON Spending Data**

### Data Transformation

When the CSV data comes into `api.tigerwatch.app`, it looks like this:

|Date|Description|Amount|Balance|
|---|---|---|---|
|11/11/2021 02:00PM|Nathan's Soup & Salad OnDemand [1705]|-9|1434.8|
|11/11/2021 12:36AM|SHH_A950_149_SNACK|-1.6|1443.8|
|11/01/2021 12:18AM|SHH_A950_151_BEVERAGE|-2.25|1445.4|
|11/08/2021 11:04AM|GOL_2942_68_BEVERAGE|-4|1447.65|
|10/30/2021 04:58PM|Global Village Cantina & Grille 2 [1591]|-11.08|1451.65|
|10/17/2021 10:50PM|GWH_1950_133_SNACK|-1.6|1462.73|  
|10/01/2021 06:07PM|Global Village Cantina & Grille 3 [1592]|-7.05|1464.33|

(and yes, these are real transactions of mine. Not all, but a cherry picked few)

The first thing to notice is that the description fields needs a **lot** of work. Transactions are not recorded by what store they happen at, rather they are associated with the POS terminal that performed the transaction. Now, normally this would be fine, however notice the `Global Village Cantina & Grille`transactions. RIT students will know that this is not a restaurant, but rather a building containing *two* restaurants: Salsarita's and the Noodle Bar. But when the POS terminals were registered, they were just registered as `[general descriptor] [terminal number]`. In this case,  the 2nd terminal is what Salsarita's uses and the 3rd & 4th terminals are what the noodle bar uses (there is no terminal 1? I looked but could not find it. My guess is that is was decommissioned). So we need a way to map all "Global Village Cantina & Grille 3" descriptors to "Salsarita's" and all other "Global Village Cantina & Grille" descriptors to Noodle Bar.

Also, notice the weird SNACK and BEVERAGE descriptors. These are *vending machines*. The format for these is `[	building code] [room number] [id] [machine type]`. There are 3 types of vending machines at RIT: `BEVERAGE`, which sells beverages (wow), `SNACK`, which sells small things like candy, and there is also `FOOD`, which sells those pre-made hamburgers and stuff. I actually have never bought from those because they look terrifying, so I have no example transaction but they do exist. However, we do not particularly care which building they were in. And even if we did, SHH, GOL, and GWH could *probably* be guessed by most RIT students (Sol Heumann Hall, Golisano, and Grace Watson Hall), but really most people don't care about which vending machine they bought from. So we need a way to group all these together. As such, we also map anything with SNACK in the description to just "Snack Vending Machine", and the same goes for BEVERAGE and FOOD.

Dates need to be readable by our React app, so we transform them into standard date strings. 

The last thing of note is the `OnDemand` flag instead of a POS terminal in the Nathan's Soup & Salad record. That is because this transaction was made with the ondemand.rit.edu online ordering portal. I made the choice to not differentiate between online orders and in-person orders, so we just ignore this flag.

The way we do this is by using a `locations.json` file to contain an array of regular expressions and corresponding readable descriptors. `locations.json` also contains an associated MaterialUI icon name to represent the category of location. The result is, given the CSV data above, the following JSON document would be sent back to the client

```json
[
    {
        "amount": -9,
        "balance": 1434.8,
        "date": "2021-11-11T14:00:00.000Z",
        "location": { "name": "Nathan's Soup & Salad", "icon": "utensils" }
    },
    {
        "amount": -1.6,
        "balance": 1443.8,
        "date": "2021-11-11T00:36:00.000Z",
        "location": { "name": "Snack Vending Machine", "icon": "cookie-bite" }
    },
    {
        "amount": -2.25,
        "balance": 1415.4,
        "date": "2021-11-11T00:36:00.000Z",
        "location": { "name": "Snack Vending Machine", "icon": "cookie-bite" }
    },
    {
        "amount": -4,
        "balance": 1447.65,
        "date": "2021-11-08T11:04:00.000Z",
        "location": { "name": "Drink Vending Machine", "icon": "wine-glass-alt" }
    },
    {
        "amount": -11.08,
        "balance": 1451.65,
        "date": "2021-10-30T16:58:00.000Z",
        "location": { "name": "Noodle Bar", "icon": "utensils" }
    },
    {
        "amount": -1.6,
        "balance": 1462.73,
        "date": "2021-10-17T22:50:00.000Z",
        "location": { "name": "Snack Vending Machine", "icon": "cookie-bite" }
    },
    {
        "amount": -7.05,
        "balance": 1464.33,
        "date": "2021-10-01T18:07:00.000Z",
        "location": { "name": "Salsarita's", "icon": "utensils" }
    }
]
```

so yeah, that's about it 😁.
