import { Component, ViewChild, ElementRef } from '@angular/core';

interface Position {
	left: number;
  top: number;
  width: number;
}

const charWidth: number = 8;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  queries: {
		content: new ViewChild( "content", {static: false} ),
	},
})
export class AppComponent {
  title = 'type-file';

  public content!: ElementRef;

  private spanArray: HTMLSpanElement[] = [];
  private currentIndex: number = 0;

  constructor() { }

  handleFileInput(files: FileList) {
    const file: File = files.item(0);
    const reader  = new FileReader();
    reader.onload = event => {
      const fullText = event.target.result.toString();

      const contentContainer = document.getElementById('contentContainer');
      for(let i=0; i<fullText.length; i++) {
        this.spanArray.push(document.createElement('span'));
        this.spanArray[i].innerHTML = fullText[i];
        contentContainer.appendChild(this.spanArray[i]);
      }

      this.currentIndex = 0;
      this.setTextColour();
    }

    reader.onerror = error => this.reject(error);
    reader.readAsText(file);
  }

  reject(error) {
    console.error(error);
  }

  setTextColour() {
    this.spanArray[this.currentIndex].innerHTML = '<u>' + this.spanArray[this.currentIndex].innerText + '</u>';
  }

  onKeydown(event) {
    console.log(event);
    console.log(event.key, this.spanArray[this.currentIndex].innerText);
    if(event.key === this.spanArray[this.currentIndex].innerText) {
      this.currentIndex++;
      this.setTextColour();
    }
  }
}
