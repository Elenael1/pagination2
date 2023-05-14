import axios from "axios";
import debounce from "debounce";
import Notiflix from "notiflix";

const KEY = '35764954-2405a3f467b19321b37277e48';
const url = 'https://pixabay.com/api/';
const http_parameters = `&image_type=photo&orientation=horizontal&safesearch=true&per_page=5`;

const refs = {
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('.q'),
    loadMore: document.querySelector('.button')
};

let page = 1;

async function fetch(q = 'apple', page) {
    try {
        const fetch = await axios.get(`${url}?key=${KEY}${http_parameters}&q=${q}&page=${page}`);
        const responce = await fetch.data;
        return responce;
    } catch (error) {
        console.log(error.message);
    }
}
refs.input.addEventListener('input', debounce(onInput, 300))

async function draw(data) {
    const markUp = data
        .map(({ comments, downloads, likes, webformatURL, tags }) => {
            return `<img src="${webformatURL}" alt="${tags}"/> <div>comments: ${comments}</div> <div>downloads: ${downloads}</div> <div>likes: ${likes}</div>`;
        })
        .join(" ");
    return markUp;
}


async function onInput(e) {
    const value = e.target.value.trim();

    if (value === '') {
        refs.gallery.innerHTML = '';
        Notiflix.Notify.info("Enter something")
        return;
    }
    const data = await fetch(value);
    const markup = await draw(data.hits);
    Notiflix.Notify.info(`Oh yes we get the ${data.total} images`)

    refs.gallery.insertAdjacentHTML('beforeend', markup);

}

refs.loadMore.addEventListener('click', onClick)

async function onClick(e) {
    const value = refs.loadMore.value.trim();
    page += 1;
    const data = await fetch(value, page);
    const markUp = await draw(data.hits);
    Notiflix.Notify.info(`Oh yes we get the ${data.total} images`)
    refs.gallery.innerHTML = '';
    refs.gallery.insertAdjacentHTML('beforeend', markUp);
}










// fetch(`${resources}?key=35764954-2405a3f467b19321b37277e48&q=apple&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`)
//     .then(responce => responce.json())
//     .then(res => console.log(res))
//     .catch(err => console.log(err))