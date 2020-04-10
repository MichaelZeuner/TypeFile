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
		wordTypedTextArea: new ViewChild( "wordTypedTextArea", {static: false} ),
    wordRemainingTextArea: new ViewChild( "wordRemainingTextArea", {static: false} ),
    textTextArea: new ViewChild( "textTextArea", {static: false} )
	},
})
export class AppComponent {
  title = 'type-file';

  public wordTypedTextArea!: ElementRef;
  public wordRemainingTextArea!: ElementRef;
  public textTextArea!: ElementRef;

	public textAreaPositionWordTyped: Position;
	public textAreaPositionWordRemaining: Position;

  text: String = '';
  words: String[] = [];
  currentWord: String;
  currentWordTypedLetters: String = '';
  currentWordRemainingLetters: String = '';
  currentLetter: String = '';
  wordIndex: number = 0;
  letterIndex: number = 0;

  constructor() {
    this.textAreaPositionWordTyped = {
      left: 0,
      top: 0,
      width: 0
    };

    this.textAreaPositionWordRemaining = {
      left: 0,
      top: 0,
      width: 0
    }
  }

  setFocus() {
    this.wordTypedTextArea.nativeElement.focus();
  }

  handleFileInput(files: FileList) {
    const file: File = files.item(0);
    const reader  = new FileReader();
    reader.onload = event => {
      console.log(event.target.result);
      this.text = event.target.result.toString();
      this.words = this.text.split(' ');
      this.wordIndex = 0;
      this.letterIndex = 0;

      console.log(this.words);
      this.refreshCurrentWord();
    }

    reader.onerror = error => this.reject(error);
    reader.readAsText(file);
  }

  reject(error) {
    console.error(error);
  }

  refreshCurrentWord() {

    this.textAreaPositionWordTyped.left = this.textTextArea.nativeElement.offsetLeft + this.offsetPreviousWord();
    this.textAreaPositionWordTyped.top = this.textTextArea.nativeElement.offsetTop;
    this.textAreaPositionWordTyped.width = (this.currentWordTypedLetters.length + 1) * charWidth;

    this.textAreaPositionWordRemaining.left = this.textTextArea.nativeElement.offsetLeft + this.offsetPreviousWord() + this.currentWordTypedLetters.length * charWidth;
    this.textAreaPositionWordRemaining.top = this.textTextArea.nativeElement.offsetTop;
    this.textAreaPositionWordRemaining.width = (this.words[this.wordIndex].length - this.currentWordTypedLetters.length) * charWidth;

    this.wordRemainingTextArea.nativeElement.value = this.words[this.wordIndex].substr(this.currentWordTypedLetters.length);
  }

  offsetPreviousWord(): number {
    let offset = 0;
    for(let i=0; i<this.wordIndex; i++) {
      offset += this.words[i].length * charWidth;
    }
    return offset;
  }

  onKeydown(event) {
    if(this.currentWordTypedLetters === this.words[this.wordIndex]) {
      console.log('MATCH');
      this.currentWordTypedLetters = '';
      this.currentWordRemainingLetters = '';
      this.wordIndex++;
    }
    this.refreshCurrentWord();
  }
}
