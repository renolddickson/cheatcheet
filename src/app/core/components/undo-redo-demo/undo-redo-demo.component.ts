import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface JsonAction {
  action: 'insert' | 'update' | 'delete';
  path: string;
  oldValue: any;
  newValue: any;
}

@Component({
  selector: 'app-undo-redo-demo',
  templateUrl: './undo-redo-demo.component.html',
  styleUrls: ['./undo-redo-demo.component.scss']
})
export class UndoRedoDemoComponent {
  normalJson!: FormControl;
  undoStack: JsonAction[][] = [];
  redoStack: JsonAction[][] = [];
  currentJson: any = {
    tag: "h1",
    style: {
      color: "white",
      size: 60,
      fontStyle: ["B", "I", "U"]
    }
  };
  tempJson: any = {};
  tempAction: JsonAction[] = []; // Global array to store all changes before onCheck

  ngOnInit(): void {
    this.normalJson = new FormControl(JSON.stringify(this.currentJson, null, 2));
  }

  onCheck() {
    if (this.isValidJSON(this.normalJson.value)) {
      this.replaceJson(this.normalJson.value);
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

  // Track changes and add to the undo stack
  diffJson(oldJson: any, newJson: any, path = '') {
    for (let key in oldJson) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in newJson)) {
        this.tempAction.push({ action: 'delete', path: currentPath, oldValue: oldJson[key], newValue: null });
      } else if (typeof oldJson[key] === 'object' && typeof newJson[key] === 'object') {
        this.diffJson(oldJson[key], newJson[key], currentPath); // Recursive call for nested objects
      } else if (oldJson[key] !== newJson[key]) {
        this.tempAction.push({ action: 'update', path: currentPath, oldValue: oldJson[key], newValue: newJson[key] });
      }
    }

    for (let key in newJson) {
      const currentPath = path ? `${path}.${key}` : key;

      if (!(key in oldJson)) {
        this.tempAction.push({ action: 'insert', path: currentPath, oldValue: null, newValue: newJson[key] });
      }
    }
  }

  // Log action for undo/redo functionality and clear tempAction
  logAction() {
    if (this.tempAction.length > 0) {
      this.undoStack.push([...this.tempAction]); // Store a copy of the tempAction
      this.redoStack = []; // Clear redo stack when a new change is made
      this.tempAction = []; // Clear tempAction for future changes
    }
  }

  // Replace current JSON and track changes
  replaceJson(newJson: string) {
    const parsedJson = JSON.parse(newJson);
    this.diffJson(this.currentJson, parsedJson); // Track differences
    this.logAction(); // Log all collected changes in tempAction at once
    this.tempJson = JSON.parse(JSON.stringify(parsedJson)); // TempJson stores a deep copy
    this.currentJson = JSON.parse(JSON.stringify(parsedJson));
  }

  // Undo function to revert last action
  undo() {
    if (this.undoStack.length === 0) return;
    const lastActionArray = this.undoStack.pop();
    if (lastActionArray) {
      lastActionArray.forEach((lastAction: JsonAction) => {
        this.applyUndoRedoAction(lastAction, 'undo');
      });
      this.redoStack.push(lastActionArray); // Push to redo stack
    }
  }

  // Redo function to apply the last undone action
  redo() {
    if (this.redoStack.length === 0) return;
    const lastActionArray = this.redoStack.pop();
    if (lastActionArray) {
      lastActionArray.forEach((lastAction: JsonAction) => {
        this.applyUndoRedoAction(lastAction, 'redo');
      });
      this.undoStack.push(lastActionArray); // Push back to undo stack
    }
  }

  // Apply undo/redo based on action type
  applyUndoRedoAction(event: JsonAction, type: 'undo' | 'redo') {
    let pathArray = event.path.split('.');
    let target = this.currentJson;
    for (let i = 0; i < pathArray.length - 1; i++) {
      target = target[pathArray[i]];
    }
    const key = pathArray[pathArray.length - 1];

    // Handle different action types (insert, delete, update)
    if ((event.action === 'insert' && type === 'undo') || (event.action === 'delete' && type === 'redo')) {
      delete target[key];
    } else if ((event.action === 'delete' && type === 'undo') || (event.action === 'insert' && type === 'redo')) {
      target[key] = (type === 'undo') ? event.oldValue : event.newValue;
    } else if (event.action === 'update') {
      target[key] = (type === 'undo') ? event.oldValue : event.newValue;
    }

    // Reflect changes in the form controls
    this.tempJson = JSON.parse(JSON.stringify(this.currentJson));
    this.normalJson?.setValue(JSON.stringify(this.currentJson, null, 2));
  }
}
