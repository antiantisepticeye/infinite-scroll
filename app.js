if (undefined) {
    let Color = require("./color");
}



let firstSection;
let lastSection;
let firstObserver;
let lastObserver;
let sectionList = [];
let container = document.getElementById('container');

function copy(str) {

	navigator.clipboard.writeText(str)

	var dummy = document.createElement("textarea");

	document.body.appendChild(dummy);
	
	dummy.value = str;
	
	if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
	
		dummy.contentEditable = true;
	
		dummy.readOnly = true;
	
		var range = document.createRange();
	
		range.selectNodeContents(dummy);
	
		var selection = window.getSelection();
	
		selection.removeAllRanges();
	
		selection.addRange(range);
	
		el.setSelectionRange(0, 999999);
	
	}
	
	else {
	
		dummy.select();
	
	}
	
	document.execCommand("copy");
	
	document.body.removeChild(dummy);
}

function addSection(isFirst=false) {

	let section = document.createElement('section');
	let col = Color.random()
	section.style.backgroundColor = col.toHex();
	
	let infoBtn = document.createElement('button');
	infoBtn.classList.add('info-btn');
	infoBtn.innerText = col.toHex();
	infoBtn.setAttribute('data-clipboard-text', 'e')
	infoBtn.style.setProperty('--selection-background', col.toHex())
	
	section.appendChild(infoBtn);
	
	let t = tippy(infoBtn, {
		content: 'copy hex',
		theme: 'tomato',
		hideOnClick: false,
		onShow: (instance) => {
				setTimeout(() => {
					instance.hide();
				}, 20000);
			},
	});
	infoBtn.addEventListener('mousedown', (e) => {
		// t.setContent('copied!')
		
		// copy(col.toHex())
		t.setProps({
			content: 'copied!',
			theme:'success',
			hideOnClick: false,
			onShow: (instance) => {
					setTimeout(() => {
						instance.hide();
					}, 2000);
				},
			onHidden: (instance) => {
				t.setProps({
					content: 'copy hex',
					theme: '',
					hideOnClick: false,
					onShow: (instance) => {
							setTimeout(() => {
								instance.hide();
							}, 20000);
					},
					onHidden() {},
					
				})
			}
		})
	})


	if(isFirst){
		sectionList.unshift(section);
		container.insertBefore(section, container.childNodes[0]);

		if(sectionList.length > 10) {
			container.removeChild(sectionList.pop())
		}
	}
	else{
		sectionList.push(section);
		container.appendChild(section);

		if(sectionList.length > 10) {
			container.removeChild(sectionList.shift())
		}
	}


	firstSection = sectionList[0];

	lastSection = sectionList[sectionList.length - 1];
	

	lastObserver = new IntersectionObserver((entries, observer) => {
		
		entries.forEach(entry => {
			if(entry.isIntersecting) {
				addSection()
				observer.disconnect()
				// console.log('up');
			}
		})
	
	})
	lastObserver.observe(lastSection)

	

	firstObserver = new IntersectionObserver((entries, observer) => {
		
		entries.forEach(entry => {
			if(entry.isIntersecting) {
				addSection(true)
				observer.disconnect()
				// console.log('up');
			}
		})
	
	})
	firstObserver.observe(firstSection)


	return section
}


document.addEventListener('DOMContentLoaded', () => {
	addSection()
	addSection()
})


