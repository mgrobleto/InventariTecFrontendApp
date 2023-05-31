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
                label: 'Facturar venta',
            },
            {
                routeLink: 'invoice/allInvoices',
                //icon: 'fas fa-laptop',
                label: 'Ver Facturas',
            },
        ]
    },
    {
        routeLink: 'products',
        icon: 'fas fa-laptop',
        label: 'Productos',
        items: [
            {
                routeLink: 'products/addNewProduct',
                //icon: 'fas fa-laptop',
                label: 'Agregar Producto',
            },
            {
                routeLink: 'products/allProducts',
                //icon: 'fas fa-laptop',
                label: 'Ver Productos',
            },
        ]
    },
     {
        routeLink: 'equipment',
        icon: 'fas fa-toolbox',
        label: 'Equipamiento',
        items: [
            {
                routeLink: 'equipment/addNewEquipment',
                //icon: 'fas fa-laptop',
                label: 'Agregar Equipamiento',
            },
            {
                routeLink: 'equipment/allEquipment',
                //icon: 'fas fa-laptop',
                label: 'Ver Equipamiento',
            },
        ]
    },
    {
        routeLink: 'settings',
        icon: 'fas fa-cogs',
        label: 'Ajustes',
    },
];