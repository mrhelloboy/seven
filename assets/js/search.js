import * as params from '@params';

const searchIcon = document.getElementById("search-icon");
const searchSection = document.getElementById("search-section");
let queryValue = "";

function cancelSearch(e) {
  queryValue = document.querySelector(".ais-SearchBox-input").value;
    if (!queryValue) {
      showOrHiddenSearch();
    }
}

searchIcon.addEventListener("click", (e)=> {
  showOrHiddenSearch();
  const resetButton = document.querySelector(".ais-SearchBox-reset");
  if("hidden" in resetButton) {
    resetButton.removeAttribute("hidden")
  }
  document.querySelector(".ais-SearchBox-resetIcon").removeEventListener("click", cancelSearch, false);
  document.querySelector(".ais-SearchBox-resetIcon").addEventListener("click", cancelSearch, false);
});

document.addEventListener("keydown", function(event) {
  if (event.code === "Escape" && searchSection.classList.contains("fixed")) {
    showOrHiddenSearch();
  }
});

function showOrHiddenSearch() {
  searchSection.classList.toggle("hidden");
  searchSection.classList.toggle("fixed");
  document.body.classList.toggle("overflow-hidden")
}

const searchClient = algoliasearch(params.api_id, params.api_key);
const search = instantsearch({
  searchClient,
  indexName: params.index,
  insights: true,
  searchFunction(helper) {
    const container = document.querySelector("#searchResults");
    const notSearch = document.querySelector("#NotSearchResults");
    if (helper.state.query === "") {
      container.style.display = "none";
      notSearch.classList.remove("hidden");
    } else {
      container.style.display = "";
      notSearch.classList.add("hidden");
    }
    helper.search();
  },
});

const { searchBox } = instantsearch.widgets;
const { configure } = instantsearch.widgets;
const { hits } = instantsearch.widgets;
const { poweredBy } = instantsearch.widgets;

search.addWidgets([
  configure({
    // hitsPerPage: 5,
    enablePersonalization: false,
    attributesToSnippet: [params.snippet],
  }),
  searchBox({
    container: "#searchBox",
    placeholder: "Search",
    showReset: false,
    showLoadingIndicator: false,
    showSubmit: true,
    searchAsYouType: false,
    autofocus: true,
    templates: {
      submit({ cssClasses }, { html }) {
        return html`<svg t="1687792593023" class="${cssClasses.submitIcon}" viewBox="0 0 1269 1024" version="1.1" width="10" height="10">
          <path d="M990.28992 695.0912l254.19776 165.56032-83.39456 128.8192-246.784-160.768A511.09888 511.09888 0 0 1 512 1024C229.21216 1024 0 794.78784 0 512S229.21216 0 512 0 1024 229.21216 1024 512a510.7712 510.7712 0 0 1-33.71008 183.0912zM512 153.6a358.4 358.4 0 1 0 0 716.8 358.4 358.4 0 0 0 0-716.8z" p-id="12490"></path>
        </svg>`
      },
    }
  }),
  hits({
    container: "#searchResults",
    templates: {
      item(hit, { html, components }) {
        return html`
        <a href="${hit.permalink}" class="flex flex-col space-y-2 justify-around hover:text-white">
          <p class="text-lg">${components.Snippet({ hit, attribute: params.snippet })}</p>
          <p class="text-sm">${components.Highlight({ hit, attribute: params.highlight })}</p>
        </a>
        `;
      },
      empty(results, { html }) {
        return html`No results for <q>${results.query}</q>`;
      },
    },
  }),
  poweredBy({
    container: "#powered-by",
  }),
]);

search.start();