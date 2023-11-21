import { INavbarData } from "./helper";

export const navbarData : INavbarData[] = [

    {
        routeLink: 'home',
        icon: 'fal fa-home',
        label: 'Dashboard',
    },
    {
        routeLink: 'invoice',
        icon: 'fas fa-file-invoice-dollar',
        label: 'Facturar',
        items: [
            {
                routeLink: 'invoice/createNewInvoice',
                //icon: 'fas fa-laptop',
                label: 'Facturar nueva venta',
            },
            {
                routeLink: 'invoice/allInvoices',
                //icon: 'fas fa-laptop',
                label: 'Historial de Ventas',
            },
        ]
    },
    {
        routeLink: 'products',
        icon: 'fas fa-archive',
        label: 'Productos',
    },
    {
        routeLink: 'categories',
        icon: 'fas fa-boxes',
        label: 'Categoría Productos',
    },
    {
        routeLink: 'suppliers',
        icon: 'fas fa-toolbox',
        label: 'Proveedores',
    },
    {
        routeLink: 'clients',
        icon: 'fas fa-user-friends',
        label: 'Clientes'
    },
    {
        routeLink: 'settings',
        icon: 'fas fa-user-tag',
        label: 'Ayuda',
    },
    /* {
        routeLink: 'logout',
        icon: 'fas fa-sign-out-alt',
        label: 'Cerrar sesión',
    }, */
];