loadJsonFileWithServer();

function loadJsonFileWithServer() {
    var xhr = new XMLHttpRequest(),
        method = "GET",
        url = "https://jsonplaceholder.typicode.com/photos";

    xhr.open(method, url, true);

    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                handlingJson(xhr.responseText)
            } else {
                console.log(xhr.status + ': ' + xhr.statusText);
            }
        }
    }
}

function handlingJson(str) {

    var fileJSON = JSON.parse(str),
        numImg = 50,
        images = [];

    for (var i = 0; i < numImg; i++) {
        images.push(fileJSON[i]);
    }

    var div = document.createDocumentFragment();

    displayImages(images, div);
}

function displayImages(images, div) {

    var imgShifted = images.shift();    

    if (imgShifted === undefined) {
        document.querySelector(".main__section__movies-grid").appendChild(div);
        return
    }

    loadImage(imgShifted.thumbnailUrl)
        .then(function (url) {

            loadImage(imgShifted.url)
                .then(function (bigUrl) {
                    
                    var temp = document.getElementsByTagName("template")[0];
                    var art = temp.content.querySelector(".main__section__movies-grid__movie");

                    a = document.importNode(art, true);
                    
                    var item1 = a.querySelector(".main__section__movies-grid__movie__img-link");
                    item1.setAttribute('href', bigUrl);

                    var item2 = a.querySelector(".main__section__movies-grid__movie__img-link__img");
                    item2.setAttribute('src', url);
                    item2.setAttribute('alt', imgShifted.title);

                    var item3 = a.querySelector(".main__section__movies-grid__movie__header__link");
                    item3.innerHTML = imgShifted.title;
        
                    div.appendChild(a);

                    return displayImages(images, div);
                })
                .catch(function (bigUrl) {
                    console.log('не удалось загрузить изображение по указанному пути: ' + bigUrl);
                    return displayImages(images);
                });

        })
        .catch(function (url) {
            console.log('не удалось загрузить изображение по указанному пути: ' + url);
            return displayImages(images);
        });
}

function loadImage(url) {
    return new Promise(function (resolve, reject) {

        var img = new Image();

        img.src = url;

        img.onload = function () {
            return resolve(url);
        }
        img.onerror = function () {
            return reject(url);
        }

    });
}