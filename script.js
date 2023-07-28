async function getData(difficulty, answer_type, id_categoria) {
  let questions = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${id_categoria}&difficulty=${difficulty}&type=${answer_type}`
  );
  questions = await questions.json();
  //   console.log(questions);
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
