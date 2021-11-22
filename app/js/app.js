'use strict';

document.addEventListener("DOMContentLoaded", function() {

		const accordions = (accordionSelector) => {
			const	accordion = document.querySelectorAll(accordionSelector);

			accordion.forEach(item => {
				const accordionClick = item.querySelector('.part__header'),
							accordionContent = item.querySelector('.part__content');
		
				accordionClick.addEventListener('click', (e) => {
					if(!item.classList.contains('part--active')) {
		
						item.classList.add('part--active')
						accordionContent.style.height = "auto"
						var height = accordionContent.clientHeight + "px"
						accordionContent.style.height = "0px"
		
						setTimeout(() => {
							accordionContent.style.height = height
						}, 0)
		
						} else {
							accordionContent.style.height = "0px"
								item.classList.remove('part--active')
					}
		
				});
			});
		
		};
		accordions('.part__accordion');

	//---------------block-none----------

		const hamburgerr = (hamburgerButton, hamburgerButtonActive, hamburgerNav, hamburgerNavActive, hamburgerHeader, headerMenuActive) => {
			const button = document.querySelectorAll(hamburgerButton),
									nav = document.querySelector(hamburgerNav),
									header = document.querySelector(hamburgerHeader);

			if(button) {
					if(nav) {

							button.forEach(element => {
									element.addEventListener('click', (e) => {
											element.classList.toggle(hamburgerButtonActive);
											nav.classList.toggle(hamburgerNavActive);
											header.classList.toggle(headerMenuActive);
									});
							});
					}
			}
	};
	hamburgerr('.header__language', 'header__language--active', '.header__language_select', 'header__language_select--active', '.header', 'a');
	hamburgerr('.btn--chapter', 'btn--chapter--active', '.part', 'part--block', '.chapter', 'chapter--active');


		//----------------------TABS-JS----------------------
	if (document.documentElement.clientWidth < 992) {
		const tabs = (headerSelector, tabSelector, contentSelector, activeClass) => {
			const header = document.querySelector(headerSelector),
						tab = document.querySelectorAll(tabSelector),
						content = document.querySelectorAll(contentSelector);
			
			if(header) {
				function hideTabContent() {
					content.forEach(item => {
						item.style.display = "none";
					});
	
					tab.forEach(item => {
						item.classList.remove(activeClass);
					});
				}
	
				function showTabContent(i = 0) {
					content[i].style.display = "block";
					tab[i].classList.add(activeClass);
				}
	
				hideTabContent();
				showTabContent();
	
				header.addEventListener('click', (e) => {
					const target = e.target;
					if (target && 
						(target.classList.contains(tabSelector.replace(/\./, '')) || 
						target.parentNode.classList.contains(tabSelector.replace(/\./, '')))) {
						tab.forEach((item, i) => {
							if (target == item || target.parentNode == item) {
								hideTabContent();
								showTabContent(i);
							}
						});
					}
				});
			}

		};
		tabs('.home', '.home__wrapper', '.tabs__wrap', 'home--active');
	};

	//----------------------HAMBURGER-----------------------
		const hamburger = (hamburgerButton, hamburgerNav, hamburgerHeader) => {
			const button = document.querySelector(hamburgerButton),
						nav = document.querySelector(hamburgerNav),
						header = document.querySelector(hamburgerHeader);
	
			button.addEventListener('click', (e) => {
				button.classList.toggle('hamburger--active');
				nav.classList.toggle('header__nav--active');
				header.classList.toggle('header--menu');
			});
	
		};
		hamburger('.hamburger', '.header__nav', '.header');

	//----------------------FORM-----------------------
		const forms = (formsSelector) => {
		const form = document.querySelectorAll(formsSelector);
		let i = 1;
		let img = 1;
		let lebel = 1;
		let prev = 1;

		form.forEach(item => {
			const elem = 'form--' + i++;
			item.classList.add(elem);

			let formId = item.id = (elem);
			let formParent = document.querySelector('#' + formId);

			formParent.addEventListener('submit', formSend);

			async function formSend(e) {
				e.preventDefault();

				let error = formValidate(item);

				let formData = new FormData(item);

				if (error === 0) {
					item.classList.add('_sending');
					let response = await fetch('sendmail.php', {
						method: 'POST',
						body: formData
					});

					if (response.ok) {
						let modalThanks = document.querySelector('#modal__thanks');
						formParent.parentNode.style.display = 'none';

						modalThanks.classList.add('active');
						item.reset();
						item.classList.remove('_sending');
					} else {
						alert('Ошибка при отправке');
						item.classList.remove('_sending');
					}

				}
			}

			function formValidate(item) {
				let error = 0;
				let formReq = formParent.querySelectorAll('._req');

				for (let index = 0; index < formReq.length; index++) {
					const input = formReq[index];
					// formRemoveError(input);

					if (input.classList.contains('_email')) {
						if(emailTest(input)) {
							formAddErrorEmail(input);
							error++;
						}
					} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
						formAddErrorCheck(input);
						error++;
					} else {
						if (input.value === '') {
							formAddError(input);
							error++;
						}
					}
				}
				return error;
			}

			const formImgFile = formParent.querySelectorAll('.formImgFile');

			formImgFile.forEach(item => { 
				const elem = 'formImgFile--' + i++;

				let formId = item.id = (elem);
				let formParent = document.querySelector('#' + formId);

				const formImage = formParent.querySelector('.formImage');
				const formLebel = formParent.querySelector('.formLebel');
				const formPreview = formParent.querySelector('.formPreview');

				//картинка в форме
				let formImageNumber = 'formImage--' + img++;
				let formPreviewNumber = 'formPreview--' + prev++;
				
				formImage.id = (formImageNumber);
				formLebel.htmlFor = ('formImage--' + lebel++);
				formPreview.id = (formPreviewNumber);
				const formImageAdd = document.querySelector('#' + formImageNumber);

				// изменения в инпуте файл
				formImageAdd.addEventListener('change', () =>  {
					uploadFile(formImage.files[0]);
				});

				function uploadFile(file) {
			
					if (!['image/jpeg', 'image/png', 'image/gif', 'image/ico', 'application/pdf'].includes(file.type)) {
						alert('Только изображения');
						formImage.value = '';
						return;
					}
			
					if (file.size > 2 * 1024 * 1024) {
						alert('Размер менее 2 мб.');
						return;
					}
			
					var reader = new FileReader();
					reader.onload = function (e) {
						if(['application/pdf'].includes(file.type)) {
							formPreview.innerHTML = `Файл выбран`;
						}else{
							formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
						}
						
					};
					reader.onerror = function (e) {
						alert('Ошибка');
					};
					reader.readAsDataURL(file);
				}
			})

			function formAddError(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Введите данные в поле";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formAddErrorEmail(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Введите свою почту";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function formAddErrorCheck(input) {
				let div = document.createElement('div');
				div.classList.add("form__error");
				div.innerHTML = "Согласие на обработку персональных данных";

				input.parentElement.append(div);
				input.parentElement.classList.add('_error');
				input.classList.add('_error');
			}

			function emailTest(input) {
				return !/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/. test(input.value);
			}

		});
		};
		forms('.form');

		const date = new Date();

		const renderCalendar = () => {
			date.setDate(1);
	
			const monthDays = document.querySelector(".days");
	
			const lastDay = new Date(
				date.getFullYear(),
				date.getMonth() + 1,
				0
			).getDate();
	
			const prevLastDay = new Date(
				date.getFullYear(),
				date.getMonth(),
				0
			).getDate();
	
			const firstDayIndex = date.getDay();
	
			const lastDayIndex = new Date(
				date.getFullYear(),
				date.getMonth() + 1,
				0
			).getDay();
	
			const nextDays = 7 - lastDayIndex - 1;
	
			const months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
	
			document.querySelector(".date h1").innerHTML = months[date.getMonth()];
	
			document.querySelector(".date p").innerHTML = new Date().toDateString();
	
			let days = "";
	
			for (let x = firstDayIndex; x > 0; x--) {
				days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
			}
	
			for (let i = 1; i <= lastDay; i++) {
				if (
					i === new Date().getDate() &&
					date.getMonth() === new Date().getMonth()
				) {
					days += `<div class="today">${i}</div>`;
				} else {
					days += `<div>${i}</div>`;
				}
			}
	
			for (let j = 1; j <= nextDays; j++) {
				days += `<div class="next-date">${j}</div>`;
				monthDays.innerHTML = days;
			}
		};
	
		document.querySelector(".prev").addEventListener("click", () => {
			date.setMonth(date.getMonth() - 1);
			renderCalendar();
		});
	
		document.querySelector(".next").addEventListener("click", () => {
			date.setMonth(date.getMonth() + 1);
			renderCalendar();
		});
	
		renderCalendar();

});
	