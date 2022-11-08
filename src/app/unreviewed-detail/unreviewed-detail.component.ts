import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import OpenSeadragon from 'openseadragon';
import {
  ProbateRecord,
  UpdateLineItemInput,
  APIService,
  UpdateProbateRecordInput,
  LineItem,
  Word,
  WordInput,
  Rect,
  CreateLineItemInput,
} from '../API.service';
import data from '../categories.json';
import { from } from 'rxjs';
import { ContextMenuModel } from '../interfaces/context-menu-model';
import { v4 as uuidv4 } from 'uuid';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList} from '@angular/cdk/drag-drop';
import {MatTable} from '@angular/material/table';

interface SubcategoryOptionValue {
  value: string;
  text: string;
}


@Component({
  selector: 'app-unreviewed-detail',
  templateUrl: './unreviewed-detail.component.html',
  styleUrls: ['./unreviewed-detail.component.sass']
})
export class UnreviewedDetailComponent implements OnInit {
  @Input() record?: ProbateRecord;
  @ViewChild('viewer') viewer!: ElementRef;
  @ViewChild('table') table!: MatTable<LineItem>;
  osd?: OpenSeadragon.Viewer;
  
  // Data table
  displayedColumns: string[] = ['title', 'category', 'subcategory', 'quantity', 'value'];

  // Context Menu
  isDisplayContextMenu = false;
  rightClickMenuItems: Array<ContextMenuModel> = [];
  rightClickMenuPositionX = 0;
  rightClickMenuPositionY = 0;

  // Data
  selectedLines: LineItem[] = [];
  wordMap = new Map<string, Word>();
  categoryMap: Map<string, Array<SubcategoryOptionValue>> =
    this.objToStrMap(data);

  constructor(
    private route: ActivatedRoute,
    private probateRecordService: APIService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    let record$ = from(this.probateRecordService.GetProbateRecord(id));
    let lineItems$ = from(
      this.probateRecordService.LineItemByProbateRecord(
        id,
        undefined,
        undefined,
        1000
      )
    );

    record$.subscribe((record) => {
      console.log(record);
      this.record = record as ProbateRecord;
      for (const word of this.record.words) {
        if (word) {
          this.wordMap.set(word.id, word);
        }
      }

      lineItems$.subscribe((lineItems) => {
        this.record!.lineItems!.items =
          lineItems.items as unknown as LineItem[];
        this.sortLineItems();        
      });

      // get our associated image     
      this.getImage(id);
    });
  }

  async getImage(id: string): Promise<void> {
    console.log('getting records');

    const infoUrl = `https://d2ai2qpooo3jtj.cloudfront.net/iiif/2/${id}/info.json`;

    this.osd = new OpenSeadragon.Viewer({
      element: this.viewer.nativeElement,
      showRotationControl: true,
      // Enable touch rotation on tactile devices
      gestureSettingsTouch: {
        pinchToZoom: true,
      },
      maxZoomLevel: 5.0,
      prefixUrl: '//openseadragon.github.io/openseadragon/images/',
      tileSources: infoUrl,
    });
  }

  sortLineItems(): void {
    if (this.record?.lineItems?.items) {
      let items: Array<LineItem> = Array.from(
        this.record.lineItems.items as LineItem[]
      );
      let sortedLineItems = items.sort(
        (a, b) => a!.boundingBox!.top - b!.boundingBox!.top
      );
      this.record.lineItems.items = sortedLineItems;
    }
  }

  displayContextMenu(event: any): void {
    this.isDisplayContextMenu = true;
    console.log(event);
    switch (this.selectedLines.length) {
      case 0:
        this.rightClickMenuItems = [
          {
            menuText: 'Create',
            menuEvent: 'create',
          },
        ];
        break;

      case 1:
        if (event.target.id.startsWith('wordInput-')) {
          let inputElem = document.getElementById(
            event.target.id
          ) as HTMLInputElement;
          if (inputElem === document.activeElement) {
            this.rightClickMenuItems = [
              {
                menuText: 'Delete Word',
                menuEvent: 'delete word',
              },
              {
                menuText: 'Adjust Box',
                menuEvent: 'adjust word box',
              },
            ];
          }
        } else {
          this.rightClickMenuItems = [
            {
              menuText: 'Split',
              menuEvent: 'split',
            },
            {
              menuText: 'Extend',
              menuEvent: 'extend',
            },
            {
              menuText: 'Shorten',
              menuEvent: 'shorten',
            },
            {
              menuText: 'Expand',
              menuEvent: 'expand',
            },
            {
              menuText: 'Correct Text',
              menuEvent: 'correct',
            },
            {
              menuText: 'Delete Line',
              menuEvent: 'delete line',
            },
          ];
        }
        break;
      default:
        this.rightClickMenuItems = [
          {
            menuText: 'Combine',
            menuEvent: 'combine',
          },
        ];
    }
    this.rightClickMenuPositionX = event.clientX;
    this.rightClickMenuPositionY = event.clientY;
    event.preventDefault();
    event.stopPropagation();
  }

  objToStrMap(obj: any) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      let props = Object.getOwnPropertyNames(obj[k]);
      strMap.set(props[0], obj[k][props[0]]);
    }
    return strMap;
  }

  populateSubcategory(lineIndex: number): void {
  }

  editLineItemByIndex(index: number): void {
  }

  deleteLineItemByIndex(index: number): void {}

  highlightText(index: number): void {}

  onSubcategoryChanged(lineIndex: number): void {}

  drop(event: CdkDragDrop<LineItem[]>) {
    // const prevIndex = this.record!.lineItems!.items.findIndex((d) => d === event.item.data);
    // moveItemInArray(this.record!.lineItems!.items, prevIndex, event.currentIndex);
    // this.table.renderRows();
    console.log(event);
    
    moveItemInArray(this.record!.lineItems!.items, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }
}
