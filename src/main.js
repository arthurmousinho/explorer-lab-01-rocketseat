import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}





const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: Number(String(new Date().getFullYear()).slice(2)), //usando o ano atual e transformando em string para pegar os ultimos dois numeros usando o slice(2)
      to: Number(String(new Date().getFullYear() + 5).slice(2)), // limite de 5 anos de validade a partir do ano de emissao
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)



const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// MONITORAR O CLIQUE DO BOTAO
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Your card has been added...")
})

// DESABILITAR RELOAD DA PAGINA AO CLICAR NO BOTAO
const buttonForm = document.querySelector("form")
buttonForm.addEventListener("submit", (event) => {
  event.preventDefault()
})


const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  if(cardHolder.value.length === 0) {
    ccHolder.innerText = "FULANDO DA SILVA"
  }
  else {
    ccHolder.innerText = cardHolder.value
  }

})



securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  if (code.length === 0) {
    ccSecurity.innerText = "123"
  }
  else {
    ccSecurity.innerText = code
  }
}





cardNumberMasked.on("accept" , () => {

  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)

  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  if (number.length === 0) {
    ccNumber.innerText = "1234 5678 9012 3456"
  }

  else {
    ccNumber.innerText = number
  }
}


expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")

  if(date.length === 0) {
    ccExpiration.innerText = "02/32"
  }
  else {
    ccExpiration.innerText = date
  }
}
