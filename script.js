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

const drop_down_lists = document.getElementsByTagName("select");
function validate_form() {
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

async function generate_trivia() {
  if (validate_form()) {
    // if (true) {
    const input_form = document.getElementById("initial-form");
    input_form.style.display = "none";
    const category_id = document.getElementById("categorySelect").value;
    const answer_type = document.getElementById("typeSelect").value;
    const difficulty = document.getElementById("difficultySelect").value;
    // const data = await getData("hard", "multiple", "10");
    const data = await getData(difficulty, answer_type, category_id);

    console.log(data);
    const trivia_container = document.getElementById(
      "result-form-trivia-container"
    );
    const form_container = document.getElementById("trivia");
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let question = element.question;
      let correct_answer = element.correct_answer;
      let incorrect_answers = element.incorrect_answers;
      let answers = [correct_answer, ...incorrect_answers];
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
        input_object.id = `q${i + 1}-a${j + 1}`; // a1 debe ser variable
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
    // form_container.style.setProperty("flex", "8");
  }
}
// generate_trivia().then(console.log("finalizado"));
document.getElementById("send").addEventListener("click", generate_trivia);
