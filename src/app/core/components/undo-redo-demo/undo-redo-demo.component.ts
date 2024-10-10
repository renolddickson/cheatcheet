import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-undo-redo-demo',
  templateUrl: './undo-redo-demo.component.html',
  styleUrls: ['./undo-redo-demo.component.scss']
})
export class UndoRedoDemoComponent {
  converter!: FormGroup;
  undoStack: any[] = [];
  redoStack: any[] = [];
  currentJson: any = {
    tag: "h1",
    style: {
      color: "white",
      size: 60,
      fontStyle:["B","I","U"]
    }
  }
  tempJson: any = {};

  ngOnInit(): void {
    this.converter = new FormGroup({
      normal: new FormControl(JSON.stringify(this.currentJson,null,2)),
      converted: new FormControl(null)
    });
  }
onCheck(){
  if (this.isValidJSON(this.converter.get('normal')?.value)) {
    this.replaceJson(this.converter.get('normal')?.value);
    this.converter.get('converted')?.setValue(this.converter.get('normal')?.value);
  } else {
    alert('Enter a valid JSON');
  }
}

  isValidJSON(jsonString: string) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Function to compare two JSON objects and log differences
  diffJson(oldJson: any, newJson: any, path = '') {
    for (let key in oldJson) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in newJson)) {
        this.logAction('delete', currentPath, oldJson[key], null);
      } else if (typeof oldJson[key] === 'object' && typeof newJson[key] === 'object') {
        this.diffJson(oldJson[key], newJson[key], currentPath);
      } else if (oldJson[key] !== newJson[key]) {
        this.logAction('update', currentPath, oldJson[key], newJson[key]);
      }
    }

    for (let key in newJson) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in oldJson)) {
        this.logAction('insert', currentPath, null, newJson[key]);
      }
    }
  }

  // Log action for undo/redo functionality
  logAction(action: string, path: string, oldValue: any, newValue: any) {
    this.undoStack.push({ action, path, oldValue, newValue });
    this.redoStack = [];
  }

  // Replace current JSON and track changes
  replaceJson(newJson: string) {
    const parsedJson = JSON.parse(newJson);
    this.diffJson(this.currentJson, parsedJson);
    this.tempJson = JSON.parse(JSON.stringify(parsedJson));
    this.currentJson = JSON.parse(JSON.stringify(parsedJson));
  }

  // Undo function to revert last action
  undo() {
    if (this.undoStack.length === 0) return;
    const lastAction = this.undoStack.pop();
    this.applyUndoRedoAction(lastAction, 'undo');
    this.redoStack.push(lastAction);
  }

  // Redo function to apply the last undone action
  redo() {
    if (this.redoStack.length === 0) return;
    const lastAction = this.redoStack.pop();
    this.applyUndoRedoAction(lastAction, 'redo');
    this.undoStack.push(lastAction);
  }

  // Apply undo/redo based on action type
  applyUndoRedoAction(event: any, type: 'undo' | 'redo') {
    let pathArray = event.path.split('.');
    let target = this.currentJson;
    for (let i = 0; i < pathArray.length - 1; i++) {
      target = target[pathArray[i]];
    }
    console.log(event);
    
    const key = pathArray[pathArray.length - 1];
    if ((event.action === 'insert' && type === 'undo')||(event.action === 'delete' && type === 'redo')) {
      delete target[key];
    } else if ((event.action === 'delete' && type === 'undo') || (event.action === 'insert' && type === 'redo')) {
      target[key] = event.newValue || event.oldValue;
    } else if (event.action === 'update') {
      target[key] = (type === 'undo') ? event.oldValue : event.newValue;
    }
    this.tempJson = JSON.parse(JSON.stringify(this.currentJson));
    this.converter.get('normal')?.setValue(JSON.stringify(this.currentJson, null, 2));
    this.converter.get('converted')?.setValue(JSON.stringify(this.currentJson, null, 2));
  }
}
