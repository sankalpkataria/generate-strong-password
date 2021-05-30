const ALGORITHMS = {
    MD5: {
        name: 'MD5',
        length: 32
    },
    SHA256: {
        name: 'SHA256',
        length: 64
    },
    SHA3: {
        name: 'SHA3',
        length: 64
    },
    HmacMD5: {
        name: 'HmacMD5',
        length: 32
    },
    HmacSHA256: {
        name: 'HmacSHA256',
        length: 64
    },
    AES: {
        name: 'AES',
        length: 44
    }
};

const hashPassword = (algorithm, password) => {
    const secret = 'Qwerty@!123456';
    switch (algorithm) {
        case ALGORITHMS.MD5.name:
            return CryptoJS.MD5(password);
        case ALGORITHMS.SHA256.name:
            return CryptoJS.SHA256(password);
        case ALGORITHMS.SHA3.name:
            return CryptoJS.SHA3(password, { outputLength: 256 });
        case ALGORITHMS.HmacMD5.name:
            return CryptoJS.HmacMD5(password, secret);
        case ALGORITHMS.HmacSHA256.name:
            return CryptoJS.HmacSHA256(password, secret);
        case ALGORITHMS.AES.name:
            return CryptoJS.AES.encrypt(password, secret);
        default:
            return password;
    }
}

const passwordInput = document.getElementById('password-input');
const submitButton = document.getElementById('submit-btn');
const copyButton = document.getElementById('copy-btn');
const hashParagraph = document.getElementById('hash');
const errorParagraph = document.getElementById('error');
const select = document.getElementById("select");
const randomInputInfo = document.getElementById("random-number-info");
const randomInput = document.getElementById("random-input");

copyButton.style.display = 'none';

Object.keys(ALGORITHMS).forEach((elem, index) => {    
    const option = document.createElement("option");
    option.value = ALGORITHMS[elem].name;
    option.textContent = `method-${index + 1}: ${elem}`;
    select.appendChild(option);
});

select.selectedIndex = 0;
randomInput.placeholder = `Enter a number between 5 and 17`;

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

const insertUpperCaseLetter = (hash, position) => {
    const hashLen = hash.length;
    for (let index = position; index < hashLen; index++) {
        const char = hash[index];
        const charCode = char.charCodeAt();
        if (charCode >= 97 && charCode <= 122) {
            return `${hash.substr(0, index)}${char.toUpperCase()}${hash.substr(index + 1, hashLen)}`;
        }
    }
    return hash;
};

const insertSpecialSymbol = (hash, position) => {
    const hashLen = hash.length;
    const allSpecialSymbols = "!#$%&'()*+,-./:;<=>?@[\]^_`{|}~";
    const NoOfSpecialSymbols = allSpecialSymbols.length;
    let specialSymbolsPosition;
    if (position < NoOfSpecialSymbols) {
        specialSymbolsPosition = position;
    } else {
        specialSymbolsPosition = position - NoOfSpecialSymbols;
    }
    return `${hash.substr(0, position)}${allSpecialSymbols[specialSymbolsPosition]}${hash.substr(position + 1, hashLen)}`;
};

select.addEventListener('change', () => {
    const maxLen = ALGORITHMS[select.value].length - 15;
    randomInput.placeholder = `Enter a number between 5 and ${maxLen}`;
});

submitButton.addEventListener('click', () =>{
    const position = parseInt(randomInput.value, 10);
    const maxLen = ALGORITHMS[select.value].length - 15;
    if (position < 5 || position > maxLen) {
        errorParagraph.innerHTML = `Number must be between 5 and ${maxLen}`;
        return;
    }
    let hash = hashPassword(select.value, passwordInput.value).toString();
    hash = insertUpperCaseLetter(hash, position);
    hash = insertUpperCaseLetter(hash, position + 5);
    hash = insertSpecialSymbol(hash, position);
    hash = insertSpecialSymbol(hash, position + 10);
    hashParagraph.innerHTML = hash;
    copyButton.style.display = 'block';
});

copyButton.addEventListener('click', () =>{
    copyTextToClipboard(hashParagraph.innerHTML);
});
