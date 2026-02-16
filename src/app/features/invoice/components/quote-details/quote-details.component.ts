import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-quote-details',
    templateUrl: './quote-details.component.html',
    styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent implements OnInit {

    public dataSource = new MatTableDataSource<any>();
    data: any;

    displayedColumns: string[] = [
        'Producto',
        'Precio',
        'Cantidad',
        'Total',
    ];

    constructor(
        public dialogRef: MatDialogRef<QuoteDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public dialogData: any
    ) { }

    ngOnInit(): void {
        this.data = this.dialogData.data;
        this.dataSource.data = this.data.products;
    }
}
