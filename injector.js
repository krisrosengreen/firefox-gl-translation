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
    overlay_element.innerHTML = "Error translating!"
  }
}

function selection_loop() {
  let div = document.getElementById("gl-translation-overlay")
  let previous_selection = "";

  setInterval(() => {
    let selected = document.getSelection();

    if (selected.anchorNode !== null) {
      let selection_string = selected.toString();
      if (selection_string !== previous_selection && selection_string.length != 0) {
        previous_selection = selection_string;

        console.log("found it!", selection_string, previous_selection);
        translate(selection_string);

        let bound = selected.getRangeAt(0).getBoundingClientRect();
        let style = "position:absolute; top:"+(bound.top+window.scrollY - 50).toString()+"px; left:"+(bound.left + (bound.width * 0.5)).toString()+ "px; visibility: visible";
        div.style = style
        div.innerHTML = "translating...";
      }
    }

    if (selected.toString().length == "") {
      div.style = "visibility: hidden"
    }

  }, 500);
}

function create_translation_div() {
  let translation_div = document.createElement("div")

  translation_div.id = "gl-translation-overlay"
  translation_div.setAttribute("class", "translation-overlay")

  document.body.appendChild(translation_div)
}

function init() {
  create_translation_div()
  selection_loop();
}

init();