const FLAGS_DATA = {
  "France": {
    "shapes": [
      { "id": "left", "fill": "#000091" },
      { "id": "mid", "fill": "#fff" },
      { "id": "right", "fill": "#e1000f" }
    ],
    "svg": `<path fill="#000091" d="M0 0h213.3v480H0z"/><path fill="#fff" d="M213.3 0h213.4v480H213.3z"/><path fill="#e1000f" d="M426.7 0H640v480H426.7z"/>`
  },
  "Germany": {
    "shapes": [
      { "id": "top", "fill": "#000001" },
      { "id": "mid", "fill": "red" },
      { "id": "bottom", "fill": "#fc0" }
    ],
    "svg": `<path fill="#fc0" d="M0 320h640v160H0z"/><path fill="#000001" d="M0 0h640v160H0z"/><path fill="red" d="M0 160h640v160H0z"/>`
  },
  "Italy": {
    "shapes": [
      { "id": "left", "fill": "#009246" },
      { "id": "mid", "fill": "#fff" },
      { "id": "right", "fill": "#ce2b37" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#009246" d="M0 0h213.3v480H0z"/><path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/></g>`
  },
  "Belgium": {
    "shapes": [
      { "id": "left", "fill": "#000001" },
      { "id": "mid", "fill": "#ffd90c" },
      { "id": "right", "fill": "#f31830" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="#000001" d="M0 0h213.3v480H0z"/><path fill="#ffd90c" d="M213.3 0h213.4v480H213.3z"/><path fill="#f31830" d="M426.7 0H640v480H426.7z"/></g>`
  },
  "Netherlands": {
    "shapes": [
      { "id": "top", "fill": "#ae1c28" },
      { "id": "mid", "fill": "#fff" },
      { "id": "bottom", "fill": "#21468b" }
    ],
    "svg": `<path fill="#ae1c28" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#21468b" d="M0 320h640v160H0z"/>`
  },
  "Ireland": {
    "shapes": [
      { "id": "left", "fill": "#009A49" },
      { "id": "mid", "fill": "#fff" },
      { "id": "right", "fill": "#FF7900" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="#fff" d="M0 0h640v480H0z"/><path fill="#009A49" d="M0 0h213.3v480H0z"/><path fill="#FF7900" d="M426.7 0H640v480H426.7z"/></g>`
  },
  "Mali": {
    "shapes": [
      { "id": "left", "fill": "#009a00" },
      { "id": "mid", "fill": "#ff0" },
      { "id": "right", "fill": "red" }
    ],
    "svg": `<g fill-rule="evenodd"><path fill="red" d="M425.8 0H640v480H425.7z"/><path fill="#009a00" d="M0 0h212.9v480H0z"/><path fill="#ff0" d="M212.9 0h214v480h-214z"/></g>`
  },
  "Romania": {
    "shapes": [
      { "id": "left", "fill": "#00319c" },
      { "id": "mid", "fill": "#ffde00" },
      { "id": "right", "fill": "#de2110" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="#00319c" d="M0 0h213.3v480H0z"/><path fill="#ffde00" d="M213.3 0h213.4v480H213.3z"/><path fill="#de2110" d="M426.7 0H640v480H426.7z"/></g>`
  },
  "Chad": {
    "shapes": [
      { "id": "left", "fill": "#002664" },
      { "id": "mid", "fill": "#fecb00" },
      { "id": "right", "fill": "#c60c30" }
    ],
    "svg": `<g fill-rule="evenodd"><path fill="#002664" d="M0 0h214v480H0z"/><path fill="#c60c30" d="M426 0h214v480H426z"/><path fill="#fecb00" d="M214 0h212v480H214z"/></g>`
  },
  "Austria": {
    "shapes": [
      { "id": "red", "fill": "#c8102e" },
      { "id": "white", "fill": "#fff" }
    ],
    "svg": `<path fill="#fff" d="M0 160h640v160H0z"/><path fill="#c8102e" d="M0 0h640v160H0zm0 320h640v160H0z"/>`
  },
  "Poland": {
    "shapes": [
      { "id": "top", "fill": "#fff" },
      { "id": "bottom", "fill": "#dc143c" }
    ],
    "svg": `<g fill-rule="evenodd"><path fill="#fff" d="M0 0h640v240H0z"/><path fill="#dc143c" d="M0 240h640v240H0z"/></g>`
  },
  "Monaco": {
    "shapes": [
      { "id": "top", "fill": "#f31830" },
      { "id": "bottom", "fill": "#fff" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="#f31830" d="M0 0h640v240H0z"/><path fill="#fff" d="M0 240h640v240H0z"/></g>`
  },
  "Indonesia": {
    "shapes": [
      { "id": "top", "fill": "#e70011" },
      { "id": "bottom", "fill": "#fff" }
    ],
    "svg": `<path fill="#e70011" d="M0 0h640v240H0Z"/><path fill="#fff" d="M0 240h640v240H0Z"/>`
  },
  "Japan": {
    "shapes": [
      { "id": "bg", "fill": "#fff" },
      { "id": "circle", "fill": "#bc002d" }
    ],
    "svg": `<defs><clipPath id="jp-a"><path fill-opacity=".7" d="M-88 32h640v480H-88z"/></clipPath></defs><g fill-rule="evenodd" stroke-width="1pt" clip-path="url(#jp-a)" transform="translate(88 -32)"><path fill="#fff" d="M-128 32h720v480h-720z"/><circle cx="523.1" cy="344.1" r="194.9" fill="#bc002d" transform="translate(-168.4 8.6)scale(.76554)"/></g>`
  },
  "Bangladesh": {
    "shapes": [
      { "id": "bg", "fill": "#006a4e" },
      { "id": "circle", "fill": "#f42a41" }
    ],
    "svg": `<path fill="#006a4e" d="M0 0h640v480H0z"/><circle cx="280" cy="240" r="160" fill="#f42a41"/>`
  },
  "Palau": {
    "shapes": [
      { "id": "bg", "fill": "#4aadd6" },
      { "id": "circle", "fill": "#ffde00" }
    ],
    "svg": `<defs><clipPath id="pw-a"><path fill-opacity=".7" d="M-70.3 0h640v480h-640z"/></clipPath></defs><g fill-rule="evenodd" stroke-width="1pt" clip-path="url(#pw-a)" transform="translate(70.3)"><path fill="#4aadd6" d="M-173.4 0h846.3v480h-846.3z"/><path fill="#ffde00" d="M335.6 232.1a135.9 130.1 0 1 1-271.7 0 135.9 130.1 0 1 1 271.7 0"/></g>`
  },
  "Switzerland": {
    "shapes": [
      { "id": "bg", "fill": "red" },
      { "id": "cross", "fill": "#fff" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="red" d="M0 0h640v480H0z"/><g fill="#fff"><path d="M170 195h300v90H170z"/><path d="M275 90h90v300h-90z"/></g></g>`
  },
  "Denmark": {
    "shapes": [
      { "id": "bg", "fill": "#c8102e" },
      { "id": "cross", "fill": "#fff" }
    ],
    "svg": `<path fill="#c8102e" d="M0 0h640.1v480H0z"/><path fill="#fff" d="M205.7 0h68.6v480h-68.6z"/><path fill="#fff" d="M0 205.7h640.1v68.6H0z"/>`
  },
  "Sweden": {
    "shapes": [
      { "id": "bg", "fill": "#005293" },
      { "id": "cross", "fill": "#fecb00" }
    ],
    "svg": `<path fill="#005293" d="M0 0h640v480H0z"/><path fill="#fecb00" d="M176 0v192H0v96h176v192h96V288h368v-96H272V0z"/>`
  },
  "Finland": {
    "shapes": [
      { "id": "bg", "fill": "#fff" },
      { "id": "cross", "fill": "#002f6c" }
    ],
    "svg": `<path fill="#fff" d="M0 0h640v480H0z"/><path fill="#002f6c" d="M0 174.5h640v131H0z"/><path fill="#002f6c" d="M175.5 0h130.9v480h-131z"/>`
  },
  "Colombia": {
    "shapes": [
      { "id": "top", "fill": "#ffe800" },
      { "id": "mid", "fill": "#00148e" },
      { "id": "bottom", "fill": "#da0010" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt"><path fill="#ffe800" d="M0 0h640v480H0z"/><path fill="#00148e" d="M0 240h640v240H0z"/><path fill="#da0010" d="M0 360h640v120H0z"/></g>`
  },
  "Lithuania": {
    "shapes": [
      { "id": "top", "fill": "#fdb913" },
      { "id": "mid", "fill": "#006a44" },
      { "id": "bottom", "fill": "#c1272d" }
    ],
    "svg": `<g fill-rule="evenodd" stroke-width="1pt" transform="scale(.64143 .96773)"><rect width="1063" height="708.7" fill="#006a44" rx="0" ry="0" transform="scale(.93865 .69686)"/><rect width="1063" height="236.2" y="475.6" fill="#c1272d" rx="0" ry="0" transform="scale(.93865 .69686)"/><path fill="#fdb913" d="M0 0h997.8v164.6H0z"/></g>`
  },
  "Gabon": {
    "shapes": [
      { "id": "top", "fill": "#36a100" },
      { "id": "mid", "fill": "#ffe700" },
      { "id": "bottom", "fill": "#006dbc" }
    ],
    "svg": `<g fill-rule="evenodd"><path fill="#ffe700" d="M640 480H0V0h640z"/><path fill="#36a100" d="M640 160H0V0h640z"/><path fill="#006dbc" d="M640 480H0V320h640z"/></g>`
  }
}
;
