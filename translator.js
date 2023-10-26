const TRANSLATION_DIV_ID = "gl-translation-overlay"
const TRANSLATION_DIV_CLASS = "translation-overlay"

async function translationFetch(word) {
  console.log("sending request")

  let val = await fetch("https://nutserut.gl/callback.php?a=kal2qdx&t="+word, {
      "credentials": "omit",
      "method": "GET",
      "mode": "cors"
  });
  
  return val;
}

async function translate(word) {
  let overlay_element = document.getElementById("gl-translation-overlay");

  let val = await translationFetch(word);

  if (val.ok) {
    let data = await val.json();
    let translation = data["moved"];
    overlay_element.innerHTML = translation;
  } else {
    overlay_element.innerHTML = "Fejl!"
  }
}

function get_translation_div() {
  return document.getElementById(TRANSLATION_DIV_ID)
}

function translate_selection() {
  let div = document.getElementById(TRANSLATION_DIV_ID)

  let text_selection = document.getSelection();

  if (text_selection.anchorNode !== null) {
    let selection_string = text_selection.toString();
    if (selection_string.length != 0) {

      let bound = text_selection.getRangeAt(0).getBoundingClientRect();
      let style = "position:absolute; top:"+(bound.top+window.scrollY - 50).toString()+"px; left:"+(bound.left + (bound.width * 0.5)).toString()+ "px; visibility: visible";
      div.style = style
      div.innerHTML = "Oversætter...";
      
      translate(selection_string)
    }
  }
}

function create_translation_div() {
  let translation_div = document.createElement("div")

  translation_div.id = TRANSLATION_DIV_ID
  translation_div.setAttribute("class", TRANSLATION_DIV_CLASS)

  document.body.appendChild(translation_div)
}

function mouse_up_event() {
  translate_selection()
}

function mouse_down_event() {
  let div = get_translation_div()
  div.style = "visibility: hidden"
}

function init() {
  create_translation_div()

  // Setup events
  window.onmouseup = mouse_up_event;
  window.onmousedown = mouse_down_event;
}

init();