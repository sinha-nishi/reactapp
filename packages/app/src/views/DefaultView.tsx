export default function NavigationView() {
    const navigation = useNavigation();
    const view = useView();
    const appbar = useAppBar();

    return <>
        {navigation}
        {view}
        {appbar}
    </>
}