#![feature(proc_macro_hygiene, decl_macro)]
#![macro_use]
extern crate rocket;

use rocket::get;
use rocket::http::{Cookie, Header, Status};
use rocket::routes;
use rocket::Response;

#[get("/")]
fn index() -> &'static str {
    "Lightweight Cookie Middle-Man (tigerwatch, lcmm)\nRun `.\\lcmm-ctl.ps1 stop` to kill this server"
}

#[get("/cb?<skey>")]
fn cb(skey: String) -> Response<'static> {
    let mut res = Response::new();
    res.set_header(Header::new("location", "http://localhost:3000"));
    res.set_header(Cookie::new("skey", skey));
    res.set_status(Status::SeeOther);

    res
}

fn main() {
    rocket::ignite().mount("/", routes![index, cb]).launch();
}
