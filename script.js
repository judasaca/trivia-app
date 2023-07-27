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
