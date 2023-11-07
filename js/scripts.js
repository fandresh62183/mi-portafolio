/*** Menu ***/

((d) => {
  const $btnMenu = d.querySelector(".menu-btn");
  const $menu = d.querySelector(".menu");

  $btnMenu.addEventListener("click", (e) => {
    $btnMenu.firstElementChild.classList.toggle("none");
    $btnMenu.lastElementChild.classList.toggle("none");
    $menu.classList.toggle("is-active");
  });

  d.addEventListener("click", (e) => {
    if (!e.target.matches(".menu a")) return false;

    $btnMenu.firstElementChild.classList.remove("none");
    $btnMenu.lastElementChild.classList.add("none");
    $menu.classList.remove("is-active");
  });
})(document);

/*** formulario ***/
((d) => {
  const $form = d.querySelector(".contact-form");
  const $loader = d.querySelector(".contact-form-loader");
  const $response = d.querySelector(".contact-form-response");

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    $loader.classList.remove("none");
    fetch("https://formsubmit.co/ajax/fandresh62183@gmail.com", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        location.hash = "#gracias";
        $form.reset();
      })
      .catch((err) => {
        let message =
          err.statusText || "Ocurrio un error al enviar, intenta nuevamente";
        $response.querySelector(
          "h3"
        ).innerHTML = `Error ${err.status}: ${message}`;
      })
      .finally(() => {
        $loader.classList.add("none");
        setTimeout(() => {
          location.hash = "#close";
        }, 3000);
      });
  });
})(document);

/*** Data ***/
const projects = [
  {
    url: "https://fandresh62183.github.io/ClonGoogle/",
    imgSrc: "assets/images/clon-google.png",
    imgAlt: "Clon de google"
  }
];

const interfaces = [
  {
    url: "https://fandresh62183.github.io/calculadora-react-freecodecamp/",
    imgSrc: "assets/images/calculadora-react-freecodecamp.png",
    imgAlt: "Calculadora",
  },
  {
    url: "https://fandresh62183.github.io/testimonio-freecodecamp/",
    imgSrc: "assets/images/testimonio-freecodecamp.png",
    imgAlt: "Testimonio de freecodecamp",
  },
  {
    url: "https://fandresh62183.github.io/Contador-de-clics/",
    imgSrc: "assets/images/Contador-de-clics.png",
    imgAlt: "Contador decclics",
  },
];

/*** Get-Data ***/
function getData(containerElement, loadingSelector, data) {
  const container = document.getElementById(containerElement);
  const loadingElement = document.getElementById(loadingSelector);

  container.classList.add("none");
  loadingElement.classList.remove("none");
  const projectElements = data.map((project) => {
    const link = document.createElement("a");
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noopener";

    const img = document.createElement("img");
    img.src = project.imgSrc;
    img.alt = project.imgAlt;
    img.draggable = "false";

    link.appendChild(img);

    return link;
  });

  Promise.all(
    projectElements.map((element) => {
      return new Promise((resolve) => {
        element.querySelector("img").onload = resolve;
      });
    })
  ).then(() => {
    setTimeout(() => {
      loadingElement.style.opacity = "0";
      container.style.opacity = "1";
      loadingElement.classList.add("none");
      container.classList.remove("none");
    }, 1000);
  });

  projectElements.reverse();
  projectElements.forEach((element) => {
    container.appendChild(element);
  });
}

/*** Carousels ***/
function handleCarousel(carouselElement, arrowIcons, firstImgSelector) {
  const carousel = document.querySelector(carouselElement);
  const firstImg = carousel.querySelector(firstImgSelector);

  let isDragStart = false;
  let isDragging = false;
  let prevPageX;
  let prevScrollLeft;
  let positionDiff;

  const showHideIcons = () => {
    const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display =
      carousel.scrollLeft == scrollWidth ? "none" : "block";
  };

  arrowIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const firstImgWidth = firstImg.clientWidth + 14;
      carousel.scrollLeft += icon.id.includes("left")
        ? -firstImgWidth
        : firstImgWidth;
      setTimeout(() => showHideIcons(), 60);
    });
  });

  const autoSlide = () => {
    if (
      carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) >
        -1 ||
      carousel.scrollLeft <= 0
    )
      return;

    positionDiff = Math.abs(positionDiff);
    const firstImgWidth = firstImg.clientWidth + 14;
    const valDifference = firstImgWidth - positionDiff;

    if (carousel.scrollLeft > prevScrollLeft) {
      carousel.scrollLeft +=
        positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
    } else {
      carousel.scrollLeft -=
        positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
    }
  };

  const dragStart = (e) => {
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
  };

  const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if (!isDragging) return;
    isDragging = false;
    autoSlide();
  };

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("touchstart", dragStart);

  document.addEventListener("mousemove", dragging);
  carousel.addEventListener("touchmove", dragging);

  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("touchend", dragStop);
}

getData("projects", "loading", projects);
getData("interfaces", "loading2", interfaces);
handleCarousel(".carousel", document.querySelectorAll(".wrapper i"), "img");
handleCarousel(".carousel2", document.querySelectorAll(".wrapper2 i"), "img");
