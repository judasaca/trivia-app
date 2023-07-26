async function getCategories() {
  let categories = await fetch("https://opentdb.com/api_category.php");
  categories = await categories.json();
  return categories.trivia_categories;
}

async function getData(difficulty, answer_type, id_categoria) {
  let questions = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${id_categoria}&difficulty=${difficulty}&type=${answer_type}`
  );
  questions = await questions.json();
  //   console.log(questions);
  return questions.results;
}
