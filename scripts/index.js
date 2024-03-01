const fetchMeal = async () => {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    console.log(data);
    return data.meals[0];
  } catch (error) {
    console.error("Ocorreu um erro ao buscar a refeição:", error);
    return null;
  }
};

const buttonRegenerate = document.querySelector("#buttonRegenerate");

function refresh() {
  location.reload();
}

buttonRegenerate.addEventListener("click", refresh);

fetchMeal().then((meal) => {
  if (meal) {
    // Supondo que videoLink seja a variável que armazena o link completo do vídeo
    const videoLink = meal.strYoutube;

    // Extrair o ID do vídeo do link completo
    const videoId = extractVideoId(videoLink);

    // Função para extrair o ID do vídeo do link completo
    function extractVideoId(link) {
      // Procurar o índice do parâmetro "v="
      const index = link.indexOf("v=");
      if (index !== -1) {
        // Extrair o ID do vídeo a partir do índice encontrado
        const videoId = link.substring(index + 2);
        // Verificar se há outros parâmetros na URL e remover, se houver
        const ampersandIndex = videoId.indexOf("&");
        if (ampersandIndex !== -1) {
          return videoId.substring(0, ampersandIndex);
        }
        return videoId;
      } else {
        // Caso "v=" não seja encontrado, o link não é válido
        return null;
      }
    }

    document.getElementById("title-meal").innerHTML = `
        <h2>${meal.strMeal ? meal.strMeal : ""}</h2>
      `;

    document.getElementById("info-meal").innerHTML = `
        <div class="info-category"><h4>${meal.strCategory ? meal.strCategory : ""}
        <h4>${meal.strArea ? meal.strArea : ""}</h4></div>
        ${meal.strTags ? `<div class="info-tag"><p>#${meal.strTags ? meal.strTags : ""}</p></div>` : ""}
      `;

    document.getElementById("texto").innerHTML = `
      <h2>Modo de preparo</h2>
      <p>${meal.strInstructions ? meal.strInstructions : ""}</p>
      `;

    document.getElementById("imagem").innerHTML = `
      <img src="${meal.strMealThumb ? meal.strMealThumb : ""}" alt="Meal Thumbnail">
      ${meal.strImageSource ? `<a href="${meal.strImageSource}">Imagem retirada de: ${meal.strImageSource}</a>` : ""}
      `;

    document.getElementById("links").innerHTML = `
      <h2>Assistir: "${meal.strMeal}"</h2>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder = "0" allowfullscreen></iframe>
      <p>Link do vídeo: <a href= "${meal.strYoutube}""> ${meal.strYoutube ? meal.strYoutube : ""}</a></p>
      ${meal.strSource ? `<p>Fonte: <a href="${meal.strSource}">${meal.strSource}</a></p>` : ""}
      `;

    document.getElementById("rodape").innerHTML = `
      <h3>${meal.strCreativeCommonsConfirmed ? meal.strCreativeCommonsConfirmed : ""}</h3>
      <h3>${meal.dataModified ? meal.dataModified : ""}</h3>
      `;

    const ingredientesLista = document.getElementById("ingredientes-lista");

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && measure) {
        const listItem = document.createElement("li");
        listItem.textContent = `${ingredient} --- ${measure}`;
        ingredientesLista.appendChild(listItem);
      }
    }
  } else {
    document.getElementById("meal").innerHTML =
      "Não foi possível carregar a receita.";
  }
});
