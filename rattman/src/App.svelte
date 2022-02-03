<script lang="ts">
    import TopAppBar, {
        Row,
        Section,
        Title as AppBarTitle,
        AutoAdjust,
        TopAppBarComponentDev,
    } from '@smui/top-app-bar';

    import Drawer, {
        Content,
        Header,
        Title as DrawerTitle,
    } from '@smui/drawer';

    import List, { Item, Text } from '@smui/list';
    import IconButton from '@smui/icon-button';

    import HomePage from './pages/Home.svelte';
    import SettingsPage from './pages/Settings.svelte';
    import AboutPage from './pages/About.svelte';

    let drawerOpen = false;
    let drawerPage = 'home';

    function drawerSetPage(val: string) {
        drawerPage = val;
        drawerOpen = false;
    }

    let topAppBar: TopAppBarComponentDev;
</script>

<main>
    <TopAppBar bind:this={topAppBar} variant="standard">
        <Row>
            <Section>
                <IconButton
                    class="material-icons"
                    on:click={() => (drawerOpen = !drawerOpen)}>menu</IconButton
                >
                <AppBarTitle>Tigerwatch</AppBarTitle>
            </Section>
            <Section align="end" toolbar>
                <IconButton class="material-icons" aria-label="Download"
                    >file_download</IconButton
                >

                <IconButton class="material-icons" aria-label="Print this page"
                    >print</IconButton
                >
                <IconButton
                    class="material-icons"
                    aria-label="Bookmark this page">bookmark</IconButton
                >
            </Section>
        </Row>
    </TopAppBar>

    <AutoAdjust {topAppBar} class="app-content">
        {#if drawerPage == 'home'}
            <HomePage />
        {/if}

        {#if drawerPage == 'settings'}
            <SettingsPage />
        {/if}

        {#if drawerPage == 'about'}
            <AboutPage />
        {/if}
    </AutoAdjust>

    <div class="drawer-container">
        <Drawer variant="dismissible" bind:open={drawerOpen}>
            <Header>
                <DrawerTitle>Tigerwatch</DrawerTitle>
            </Header>
            <Content>
                <List>
                    <Item
                        href="javascript:void(0)"
                        on:click={() => drawerSetPage('home')}
                        activated={drawerPage == 'home'}
                    >
                        <Text>Home</Text>
                    </Item>
                    <Item
                        href="javascript:void(0)"
                        on:click={() => drawerSetPage('settings')}
                        activated={drawerPage == 'settings'}
                    >
                        <Text>Settings</Text>
                    </Item>
                    <Item
                        href="javascript:void(0)"
                        on:click={() => drawerSetPage('about')}
                        activated={drawerPage == 'about'}
                    >
                        <Text>About</Text>
                    </Item>
                </List>
            </Content>
        </Drawer>
    </div>
</main>

<style>
    .bottom-navbar {
        position: absolute;
        bottom: 0px;
        width: 100vw;
    }

    .app-content {
        overflow: auto;
        padding: 16px;
        height: 100%;
        box-sizing: border-box;
    }

    /* These classes are only needed because the
    drawer is in a container on the page. */
    .drawer-container {
    }
</style>
