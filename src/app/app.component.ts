import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { itemTypeList } from './common/ItemTypes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shop';
  itemTypeList=itemTypeList;
  isBlinking = false;
  isBlinkingIndex: number | null = null;
  handlItemClick(item:string,index:number){
    this.isBlinking = true;
    this.isBlinkingIndex = index;
    // Выключаем мигание через 1 секунду
    setTimeout(() => {
      this.isBlinkingIndex = null;
      this.isBlinking = false;
    }, 750);
    console.log(item)
  }
}
