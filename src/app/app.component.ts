import { Component, ViewChild, ElementRef } from '@angular/core';

interface ElementData {
  text: string;
  class: string;
}

enum CharacterEnum {
  None = '',
  NextLetter = 'nextLetter',
  IncorrectLetter = 'incorrectLetter',
  CorrectLetter = 'correctLetter'
}

const ENTER_CHAR = '&#x21a9;';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  queries: {
    content: new ViewChild("content", { static: false }),
  },
})
export class AppComponent {

  public ENTER_CHAR = ENTER_CHAR;

  private spanArray: ElementData[] = [];
  private currentIndex: number = 0;

  constructor() { }

  handleFileInput(files: FileList) {
    const file: File = files.item(0);
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      const eventTarget: any = event.target;
      const fullText = eventTarget.result.toString();

      for (let i = 0; i < fullText.length; i++) {
        let val = fullText[i];
        if (fullText.charCodeAt(i) === 10) {
          val = ENTER_CHAR;
        }

        this.spanArray.push({
          text: val,
          class: ''
        });
      }

      this.currentIndex = 0;
      this.setTextColour(CharacterEnum.NextLetter);
    }

    reader.onerror = error => this.reject(error);
    reader.readAsText(file);
  }

  reject(error) {
    console.error(error);
  }

  setTextColour(color: CharacterEnum) {
    this.spanArray[this.currentIndex].class = color;
  }

  reset() {
    this.currentIndex = 0;
    this.spanArray = [];
    (<HTMLInputElement>document.getElementById('fileInputId')).value = null;
    const contentContainer = document.getElementById('contentContainer');
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.lastChild);
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === "Backspace") {
      this.setTextColour(CharacterEnum.None);
      this.currentIndex--;
    }
    else if (event.key.length === 1 || event.key === "Enter") {
      if (event.key === this.spanArray[this.currentIndex].text || (event.key === "Enter" && this.spanArray[this.currentIndex].text === ENTER_CHAR)) {
        this.setTextColour(CharacterEnum.CorrectLetter);
      } else {
        this.setTextColour(CharacterEnum.IncorrectLetter);
      }
      this.currentIndex++;
      (<HTMLInputElement>document.getElementById('inputTextId')).value = null;
    }
    this.setTextColour(CharacterEnum.NextLetter);
  }
}
