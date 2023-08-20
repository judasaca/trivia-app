async function getData(difficulty, answer_type, id_categoria) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json; charset=UTF-8");
  let questions = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${id_categoria}&difficulty=${difficulty}&type=${answer_type}`,
    myHeaders
  );
  questions = await questions.json();
  return questions.results;
}
async function getCategories() {
  let categories = await fetch("https://opentdb.com/api_category.php");
  categories = await categories.json();
  return categories.trivia_categories;
}

function setCategoryOptions() {
  const category_options = document.getElementById("categorySelect");
  getCategories().then((categories) => {
    categories.forEach((element) => {
      let { id, name } = element;
      const option = document.createElement("option");
      option.setAttribute("value", id);
      option.textContent = name;
      category_options.appendChild(option);
    });
  });
}
setCategoryOptions();

function validate_form() {
  const drop_down_lists = document.getElementsByTagName("select");
  let all_selected = true;
  for (let i = 0; i < drop_down_lists.length; i++) {
    const value = drop_down_lists[i].value;
    if (value === "Seleccionar...") {
      all_selected = false;
      break;
    }
  }
  return all_selected;
}

function addValidationToSendButton() {
  const drop_down_lists = document.getElementsByTagName("select");
  const send_button = document.getElementById("send");
  for (let i = 0; i < drop_down_lists.length; i++) {
    const list = drop_down_lists[i];
    list.addEventListener("change", () => {
      if (validate_form()) {
        send_button.classList.add("active");
      } else {
        send_button.classList.remove("active");
      }
    });
  }
}
addValidationToSendButton();

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let CA = [];
async function generate_trivia() {
  if (validate_form()) {
    const input_form = document.getElementById("initial-form");
    input_form.style.display = "none";
    const category_id = document.getElementById("categorySelect").value;
    const answer_type = document.getElementById("typeSelect").value;
    const difficulty = document.getElementById("difficultySelect").value;

    const data = await getData(difficulty, answer_type, category_id);

    const trivia_container = document.getElementById(
      "result-form-trivia-container"
    );
    const form_container = document.getElementById("trivia");
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let question = element.question;
      let correct_answer = element.correct_answer;
      let incorrect_answers = element.incorrect_answers;
      let ordered_answers = [correct_answer, ...incorrect_answers];
      let new_indexes = shuffle([0, 1, 2, 3]);
      console.log(new_indexes);
      let answers = new Array(ordered_answers.length);
      for (let i = 0; i < new_indexes.length; i++) {
        const new_index = new_indexes[i];
        answers[new_index] = ordered_answers[i];
      }
      console.log(answers);
      CA.push({
        q: i + 1,
        a: new_indexes[0] + 1,
      });
      const trivia_item = document.createElement("div");
      trivia_item.classList.add("trivia-item");
      const question_item = document.createElement("p");
      question_item.classList.add("question");
      question_item.innerHTML = `${i + 1}. ` + question;
      trivia_item.appendChild(question_item);

      for (let j = 0; j < answers.length; j++) {
        const answer_container = document.createElement("div");
        answer_container.classList.add("answer-container");
        const answer = answers[j];
        const input_object = document.createElement("input");
        input_object.type = "radio";
        input_object.id = `q${i + 1}-a${j + 1}`;
        input_object.name = `q${i + 1}`;
        answer_container.appendChild(input_object);

        const label_object = document.createElement("label");
        label_object.setAttribute("for", `q${i + 1}-a${j + 1}`);
        label_object.innerHTML = answer;
        answer_container.appendChild(label_object);
        trivia_item.appendChild(answer_container);
      }

      form_container.appendChild(trivia_item);
    }
    trivia_container.style.display = "flex";
    addValidationToSendExamButton();
  }
}

async function cancel_exam() {
  const trivia_container = document.getElementById(
    "result-form-trivia-container"
  );
  trivia_container.style.display = "none";
  const form_container = document.getElementById("trivia");
  form_container.innerHTML = "";
  const input_form = document.getElementById("initial-form");
  input_form.style.display = "block";
  input_form.innerHTML = `
  <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="difficultySelect"
            >Dificultad</label
          >
        </div>
        <select class="custom-select" id="difficultySelect">
          <option selected>Seleccionar...</option>
          <option value="easy">Facil</option>
          <option value="medium">Medio</option>
          <option value="hard">Dificil</option>
        </select>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="typeSelect">Tipo</label>
        </div>
        <select class="custom-select" id="typeSelect">
          <option selected>Seleccionar...</option>
          <option value="multiple">Selección múltiple</option>
          <option value="boolean">Verdadero / Falso</option>
        </select>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="categorySelect">Categoría</label>
        </div>
        <select class="custom-select" id="categorySelect">
          <option selected>Seleccionar...</option>
        </select>
      </div>
      <div id="button-container">
        <button id="send" class="button">Enviar</button>
      </div>
  `;
  const send = document.getElementById("send");
  send.classList.remove("active");
  setCategoryOptions();
  addValidationToSendButton();
  document.getElementById("send").addEventListener("click", generate_trivia);
  document
    .querySelector("#send-exam button")
    .classList.remove("send-exam-active");
  CA = [];
}

document.getElementById("send").addEventListener("click", generate_trivia);
document.getElementById("cancel-exam").addEventListener("click", cancel_exam);

function validateFilledExam() {
  let filled = true;
  for (let i = 1; i <= 10; i++) {
    let checked_answer = document.querySelector(`input[name="q${i}"]:checked`);
    if (checked_answer === null) {
      filled = false;
      break;
    }
  }
  return filled;
}

function addValidationToSendExamButton() {
  const send_exam_button = document.querySelector("#send-exam button");
  const input_buttons = document.querySelectorAll(
    "#trivia input[type='radio']"
  );
  console.log(input_buttons);
  for (let i = 0; i < input_buttons.length; i++) {
    const input_button = input_buttons[i];
    input_button.addEventListener("change", () => {
      if (validateFilledExam()) {
        send_exam_button.classList.add("send-exam-active");
      } else {
        send_exam_button.classList.remove("send-exam-active");
      }
    });
  }
}

function color_answers() {
  let answers = document.querySelectorAll(`.answer-container`);
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    answer.classList.add("wrong-answer");
  }
  for (let j = 0; j < CA.length; j++) {
    let { q, a } = CA[j];
    let correct_answer = document.querySelector(
      `.answer-container:has(>#q${q}-a${a})`
    );
    correct_answer.classList.remove("wrong-answer");
    correct_answer.classList.add("correct-answer");
  }
}
function deactivateInputs() {
  const inputs = document.querySelectorAll("input[type='radio']");
  for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    element.disabled = true;
  }
}
function evaluateExam() {
  if (validateFilledExam()) {
    let points = 0;
    for (let question_number = 1; question_number <= 10; question_number++) {
      let answer = document.querySelector(
        `input[name="q${question_number}"]:checked`
      );
      let id_answer = answer.id;
      id_answer = id_answer.split("-")[1].replace("a", "");
      id_answer = parseInt(id_answer);
      if (CA[question_number - 1].a === id_answer) {
        points += 100;
      }
    }
    const popup = document.querySelector("#results-popup");
    popup.style.display = "flex";
    const popup_message = document.querySelector("#results-message");
    popup_message.innerHTML = `Tu puntaje fue de ${points}`;
    console.log("tu puntaje fue de " + points);
    color_answers();
    deactivateInputs();
  }
}

document
  .querySelector("#send-exam button")
  .addEventListener("click", evaluateExam);

function close_popup() {
  const popup = document.querySelector("#results-popup");
  popup.style.display = "none";
  const popup_message = document.querySelector("#results-message");
  popup_message.innerHTML = "";
}
document
  .querySelector("#close-popup img")
  .addEventListener("click", close_popup);
