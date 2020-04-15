import { Component, ViewChild, ElementRef } from '@angular/core';
import { iif } from 'rxjs';

interface ElementData {
  text: string;
  class: CharacterEnum;
  breakLine: boolean;
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

  private spanArray: ElementData[] = [];
  private currentIndex: number = 0;

  private startTime: Date = null;
  private endTime: Date = null;
  private wpm: number = -1;
  private errors: number = -1;

  constructor() { }

  handleFileInput(files: FileList) {
    const file: File = files.item(0);
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      const eventTarget: any = event.target;
      const fullText = eventTarget.result.toString();

      for (let i = 0; i < fullText.length; i++) {
        let val = fullText[i];
        let breakLine = false;
        if (fullText.charCodeAt(i) === 10) {
          val = ENTER_CHAR;
          breakLine = true;
        } else if (fullText.charCodeAt(i) === 13) {
          continue;
        }

        this.spanArray.push({
          text: val,
          class: CharacterEnum.None,
          breakLine: breakLine
        });
      }

      this.currentIndex = 0;
      this.setTextColour(CharacterEnum.NextLetter);
      document.getElementById('inputTextId').focus();
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
    this.wpm = -1;
    this.errors = -1;
    this.startTime = null;
    this.endTime = null;
    this.spanArray = [];
    (<HTMLInputElement>document.getElementById('fileInputId')).value = null;
    const contentContainer = document.getElementById('contentContainer');
    while (contentContainer.firstChild) {
      contentContainer.removeChild(contentContainer.lastChild);
    }
  }

  convertKey(key: string): string {
    if (key.length === 1) {
      return key;
    }
    else if (key === 'Enter') {
      return ENTER_CHAR;
    }
    else {
      return key;
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (this.endTime === null) {
      if (this.startTime === null) {
        this.startTime = new Date();
      }

      if (event.key === "Backspace") {
        this.setTextColour(CharacterEnum.None);
        this.currentIndex--;
      }
      else if (event.key.length === 1 || event.key === "Enter") {
        if (this.convertKey(event.key) === this.spanArray[this.currentIndex].text) {
          this.setTextColour(CharacterEnum.CorrectLetter);
        } else {
          this.setTextColour(CharacterEnum.IncorrectLetter);

          const correctKey = this.spanArray[this.currentIndex].text;
          this.spanArray[this.currentIndex].text = this.convertKey(event.key);
          setTimeout(this.incorrectKeyTimeoutFunction, 500, this.spanArray, correctKey, this.currentIndex);
        }
        this.currentIndex++;
        (<HTMLInputElement>document.getElementById('inputTextId')).value = null;
      }

      if (this.currentIndex < this.spanArray.length) {
        this.setTextColour(CharacterEnum.NextLetter);
      } else {
        this.endTest();
      }
    }
  }

  endTest() {
    this.endTime = new Date();
    const ms = this.endTime.getTime() - this.startTime.getTime();
    const words = this.spanArray.length / 5;
    const minutes = ms / 1000 / 60;
    this.wpm = words / (minutes);

    this.errors = 0;
    for (let i = 0; i < this.spanArray.length; i++) {
      if (this.spanArray[i].class === CharacterEnum.IncorrectLetter) {
        this.errors++;
      }
    }

    console.log('Time', ms, minutes);
    console.log('words', words);
    console.log('errors', this.errors);
    console.log('WPM', this.wpm)
  }

  incorrectKeyTimeoutFunction(spanArray, correctKey, index) {
    spanArray[index].text = correctKey;
  }
}
