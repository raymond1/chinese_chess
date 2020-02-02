function FocusManager(){
    this.focusObject = null;
    this.registerFocus = registerFocus;
}

function registerFocus(object){
    if (this.focusObject == null){
    }
    else{
        this.focusObject.hasFocus = false;
    }
    this.focusObject = object;
    this.focusObject.hasFocus = true;
}