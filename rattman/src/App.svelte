<script lang="ts">
    import TopAppBar, {
        Row,
        Section,
        Title,
        AutoAdjust,
        TopAppBarComponentDev,
    } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import Tab, { Icon, Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

    const tabs = [
        {
            k: 1,
            icon: 'code',
            label: 'Code',
        },
        {
            k: 2,
            icon: 'code',
            label: 'Code',
        },
    ];

    let active = tabs[0];

    let topAppBar: TopAppBarComponentDev;
</script>

<main>
    <TopAppBar bind:this={topAppBar} variant="standard">
        <Row>
            <Section>
                <IconButton class="material-icons">menu</IconButton>
                <Title>Tigerwatch</Title>
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
    <AutoAdjust sx={{ margin: '6px' }} {topAppBar}>
        <h1>Hello!</h1>
    </AutoAdjust>
    <div class="bottom-navbar">
        <TabBar {tabs} let:tab key={(tab) => tab.k} bind:active>
            <Tab
                {tab}
                stacked={true}
                indicatorSpanOnlyContent={true}
                tabIndicator$transition="fade"
            >
                <Icon class="material-icons">{tab.icon}</Icon>
                <Label>{tab.label}</Label>
            </Tab>
        </TabBar>
    </div>
</main>
