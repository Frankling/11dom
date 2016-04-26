var UIColorPicker = (function UIColorPicker() {
	'use strict';
	var subscribers = [];
	var pickers = [];

	/**
	 * RGBA Color class
	 *
	 * HSV/HSB and HSL (hue, saturation, value / brightness, lightness)
	 * @param hue			0-360
	 * @param saturation	0-100
	 * @param value 		0-100
	 * @param lightness		0-100
	 */
	function Color(color) {

		if(color instanceof Color === true) {
			this.copy(color);
			return;
		}

		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.hue = 0;
		this.saturation = 0;
		this.value = 0;
	}

	function RGBColor(r, g, b) {
		var color = new Color();
		color.setRGBA(r, g, b, 1);
		return color;
	}

	function HSVColor(h, s, v) {
		var color = new Color();
		color.setHSV(h, s, v);
		return color;
	}
	Color.prototype.copy = function copy(obj) {
		if(obj instanceof Color !== true) {
			console.log('Typeof parameter not Color');
			return;
		}

		this.r = obj.r;
		this.g = obj.g;
		this.b = obj.b;
		this.a = obj.a;
		this.hue = obj.hue;
		this.value = obj.value;
	};

	/*========== Methods to set Color Properties ==========*/
	Color.prototype.isValidRGBValue = function isValidRGBValue(value) {
		return (typeof(value) === 'number' && isNaN(value) === false &&
		value >= 0 && value <= 255);
	};

	Color.prototype.setRGBA = function setRGBA(red, green, blue, alpha) {
		if (this.isValidRGBValue(red) === false ||
			this.isValidRGBValue(green) === false ||
			this.isValidRGBValue(blue) === false)
			return;

		this.r = red | 0;
		this.g = green | 0;
		this.b = blue | 0;

		if (this.isValidRGBValue(alpha) === true)
			this.a = alpha | 0;
	};
	Color.prototype.setByName = function setByName(name, value) {
		if (name === 'r' || name === 'g' || name === 'b') {
			if(this.isValidRGBValue(value) === false)
				return;

			this[name] = value;
			this.updateHSX();
		}
	};
	Color.prototype.setHSV = function setHSV(hue, saturation, value) {
		this.hue = hue;
		this.saturation = saturation;
		this.value = value;
		this.HSVtoRGB();
	};
	Color.prototype.setHue = function setHue(value) {
		if (typeof(value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 359)
			return;
		this.hue = value;
		this.updateRGB();
	};

	Color.prototype.setSaturation = function setSaturation(value) {
		if (typeof(value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 100)
			return;
		this.saturation = value;
		this.updateRGB();
	};

	Color.prototype.setValue = function setValue(value) {
		if (typeof(value) !== 'number' || isNaN(value) === true ||
			value < 0 || value > 100)
			return;
		this.value = value;
		this.HSVtoRGB();
	};

	Color.prototype.setHexa = function setHexa(value) {
		var valid  = /(^#{0,1}[0-9A-F]{6}$)|(^#{0,1}[0-9A-F]{3}$)/i.test(value);

		if (valid !== true)
			return;

		if (value[0] === '#')
			value = value.slice(1, value.length);

		if (value.length === 3)
			value = value.replace(/([0-9A-F])([0-9A-F])([0-9A-F])/i,'$1$1$2$2$3$3');

		this.r = parseInt(value.substr(0, 2), 16);
		this.g = parseInt(value.substr(2, 2), 16);
		this.b = parseInt(value.substr(4, 2), 16);

		this.RGBtoHSV();
	};

	/*========== Conversion Methods ==========*/
	Color.prototype.convertToHSV = function convertToHSV() {
		this.RGBtoHSV();
	};

	/*========== Update Methods ==========*/

	Color.prototype.updateRGB = function updateRGB() {
		this.HSVtoRGB();
		return;

	};

	Color.prototype.updateHSX = function updateHSX() {
		this.RGBtoHSV();
		return;


	};

	Color.prototype.HSVtoRGB = function HSVtoRGB() {
		var sat = this.saturation / 100;
		var value = this.value / 100;
		var C = sat * value;
		var H = this.hue / 60;
		var X = C * (1 - Math.abs(H % 2 - 1));
		var m = value - C;
		var precision = 255;

		C = (C + m) * precision | 0;
		X = (X + m) * precision | 0;
		m = m * precision | 0;

		if (H >= 0 && H < 1) {	this.setRGBA(C, X, m);	return; }
		if (H >= 1 && H < 2) {	this.setRGBA(X, C, m);	return; }
		if (H >= 2 && H < 3) {	this.setRGBA(m, C, X);	return; }
		if (H >= 3 && H < 4) {	this.setRGBA(m, X, C);	return; }
		if (H >= 4 && H < 5) {	this.setRGBA(X, m, C);	return; }
		if (H >= 5 && H < 6) {	this.setRGBA(C, m, X);	return; }
	};


	Color.prototype.RGBtoHSV = function RGBtoHSV() {
		var red		= this.r / 255;
		var green	= this.g / 255;
		var blue	= this.b / 255;
		var cmax = Math.max(red, green, blue);
		var cmin = Math.min(red, green, blue);
		var delta = cmax - cmin;
		var hue = 0;
		var saturation = 0;

		if (delta) {
			if (cmax === red ) { hue = ((green - blue) / delta); }
			if (cmax === green ) { hue = 2 + (blue - red) / delta; }
			if (cmax === blue ) { hue = 4 + (red - green) / delta; }
			if (cmax) saturation = delta / cmax;
		}

		this.hue = 60 * hue | 0;
		if (this.hue < 0) this.hue += 360;
		this.saturation = (saturation * 100) | 0;
		this.value = (cmax * 100) | 0;
	};



	/*========== Get Methods ==========*/

	Color.prototype.getHexa = function getHexa() {
		var r = this.r.toString(16);
		var g = this.g.toString(16);
		var b = this.b.toString(16);
		if (this.r < 16) r = '0' + r;
		if (this.g < 16) g = '0' + g;
		if (this.b < 16) b = '0' + b;
		var value = '#' + r + g + b;
		return value.toUpperCase();
	};

	Color.prototype.getRGBA = function getRGBA() {

		var rgb = '(' + this.r + ', ' + this.g + ', ' + this.b;
		var a = '';
		var v = '';
		var x = parseFloat(this.a);
		if (x !== 1) {
			a = 'a';
			v = ', ' + x;
		}

		var value = 'rgb' + a + rgb + v + ')';
		return value;
	};

	Color.prototype.getColor = function getColor() {
		if (this.a | 0 === 1)
			return this.getHexa();
		return this.getRGBA();
	};

	/*=======================================================================*/
	/*=======================================================================*/

	/*========== Capture Mouse Movement ==========*/

	var setMouseTracking = function setMouseTracking(elem, callback) {
		elem.addEventListener('mousedown', function(e) {
			callback(e);
			document.addEventListener('mousemove', callback);
		});

		document.addEventListener('mouseup', function(e) {
			document.removeEventListener('mousemove', callback);
		});
	};

	/*====================*/
	// Color Picker Class
	/*====================*/

	function ColorPicker(node) {

		node.setAttribute("value","#000000");
		this.node = node;
		this.color = new Color();
		this.subscribers = [];

		var topic = this.node.getAttribute('data-topic');

		this.topic = topic;

		this.createPickingArea();
		this.createHueArea();

		this.newInputComponent('R', 'red', this.inputChangeRed.bind(this));
		this.newInputComponent('G', 'green', this.inputChangeGreen.bind(this));
		this.newInputComponent('B', 'blue', this.inputChangeBlue.bind(this));

		this.createPreviewBox();
		this.newInputComponent('hexa', 'hexa', this.inputChangeHexa.bind(this));
		node.addEventListener("mouseup",this.inputChangeHexa2.bind(this));
		node.addEventListener("click",this.inputChangeHexa1.bind(this));
		this.setColor(this.color);
		pickers[topic] = this;


		/*node.addEventListener("click",function(e){
		 console.log(e.target.getAttribute("value"))
		 })*/

	}

	/*************************************************************************/
	//				Function for generating the color-picker
	/*************************************************************************/

	ColorPicker.prototype.createPickingArea = function createPickingArea() {
		var area = document.createElement('div');
		var picker = document.createElement('div');

		area.className = 'picking-area';
		picker.className = 'picker';

		this.picking_area = area;
		this.color_picker = picker;
		setMouseTracking(area, this.updateColor.bind(this));

		area.appendChild(picker);
		this.node.appendChild(area);
	};

	ColorPicker.prototype.createHueArea = function createHueArea() {
		var area = document.createElement('div');
		var picker = document.createElement('div');

		area.className = 'hue';
		picker.className ='slider-picker';

		this.hue_area = area;
		this.hue_picker = picker;
		setMouseTracking(area, this.updateHueSlider.bind(this));

		area.appendChild(picker);
		this.node.appendChild(area);
	};



	ColorPicker.prototype.createPreviewBox = function createPreviewBox(e) {
		var preview_color = document.createElement('div');
		preview_color.className = 'preview-color';
		this.preview_color = preview_color;
	};

	ColorPicker.prototype.newInputComponent = function newInputComponent(title, topic, onChangeFunc) {
		var wrapper = document.createElement('div');
		var input = document.createElement('input');
		var info = document.createElement('span');

		wrapper.className = 'input';
		wrapper.setAttribute('data-topic', topic);
		info.textContent = title;
		info.className = 'name';
		input.setAttribute('type', 'text');

		wrapper.appendChild(info);
		wrapper.appendChild(input);
		this.node.appendChild(wrapper);
		var node = this.node;
		input.addEventListener('change', onChangeFunc);
		input.addEventListener('change',this.inputChangeHexa2.bind(this));
		this.subscribe(topic, function(value) {
			input.value = value;
		});
	};


	/*************************************************************************/
	//					Updates properties of UI elements
	/*************************************************************************/

	ColorPicker.prototype.updateColor = function updateColor(e) {
		var x = e.pageX - this.picking_area.getBoundingClientRect().left;
		var y = e.pageY - this.picking_area.getBoundingClientRect().top;

		// width and height should be the same
		var size_x = this.picking_area.clientWidth;
		var size_y = this.picking_area.clientHeight;

		if (x > size_x) x = size_x;
		if (y > size_y) y = size_y;
		if (x < 0) x = 0;
		if (y < 0) y = 0;

		var value = 100 - (y * 100 / size_y) | 0;
		var saturation = x * 100 / size_x | 0;
		this.color.setHSV(this.color.hue, saturation, value);
		this.color_picker.style.left = x + 'px';
		this.color_picker.style.top = y + 'px';
		this.notify('value', value);
		this.notify('saturation', saturation);

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.getHexa());

		notify(this.topic, this.color);
	};

	ColorPicker.prototype.updateHueSlider = function updateHueSlider(e) {
		var y = e.pageY - this.hue_area.getBoundingClientRect().top;
		var height = this.hue_area.clientHeight;
		if (y < 0) y = 0;
		if (y > height) y = height;
		var hue = ((359 * y) / height) | 0;
		this.updateSliderPosition(this.hue_picker, y - 1);
		this.setHue(hue);
	};

	ColorPicker.prototype.setHue = function setHue(value) {
		this.color.setHue(value);

		this.updatePickerBackground();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);
		this.notify('hexa', this.color.getHexa());
		this.notify('hue', this.color.hue);

		notify(this.topic, this.color);
	};


	/*************************************************************************/
	//				Update positions of various UI elements
	/*************************************************************************/

	ColorPicker.prototype.updatePickerPosition = function updatePickerPosition() {
		var size_x = 120;
		var size_y = 100;

		var value = 0;

		//if (this.picker_mode === 'HSV')
		value = this.color.value;


		var x = (this.color.saturation * size_x / 100) | 0;
		var y = size_y - (value * size_y / 100) | 0;

		this.color_picker.style.left = x + 'px';
		this.color_picker.style.top = y + 'px';
	};

	ColorPicker.prototype.updateSliderPosition = function updateSliderPosition(elem, pos) {
		elem.style.top = pos + 'px';
	};

	ColorPicker.prototype.updateHuePicker = function updateHuePicker() {
		var size = this.hue_area.clientHeight;
		var pos = (this.color.hue * size / 360 ) | 0;
		this.hue_picker.style.top = pos + 'px';
	};


	/*************************************************************************/
	//						Update background colors
	/*************************************************************************/

	ColorPicker.prototype.updatePickerBackground = function updatePickerBackground() {
		var nc = new Color(this.color);
		nc.setHSV(nc.hue, 100, 100);
		this.picking_area.style.backgroundColor = nc.getHexa();
	};




	/*************************************************************************/
	//						Update input elements
	/*************************************************************************/

	ColorPicker.prototype.inputChangeRed = function inputChangeRed(e) {
		var value = parseInt(e.target.value);
		this.color.setByName('r', value);
		e.target.value = this.color.r;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeGreen = function inputChangeGreen(e) {
		var value = parseInt(e.target.value);
		this.color.setByName('g', value);
		e.target.value = this.color.g;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeBlue = function inputChangeBlue(e) {
		var value = parseInt(e.target.value);
		this.color.setByName('b', value);
		e.target.value = this.color.b;
		this.setColor(this.color);
	};

	ColorPicker.prototype.inputChangeHexa = function inputChangeHexa(e) {
		var value = e.target.value;
		this.color.setHexa(value);
		this.setColor(this.color);
		this.node.setAttribute("value",this.color.getHexa());

	};
	ColorPicker.prototype.inputChangeHexa1 = function inputChangeHexa1(e) {
		var value = e.target.getAttribute("value");
		this.color.setHexa(value);
		this.setColor(this.color);
		//this.node.setAttribute("value",this.color.getHexa())
		//console.log(this.node)

	};
	ColorPicker.prototype.inputChangeHexa2 = function inputChangeHexa2(e) {
		console.log(this.color.getHexa())
		this.setColor(this.color);
		this.node.setAttribute("value",this.color.getHexa());
		this.node.click();

		//console.log(this.node)

	};

	/*************************************************************************/
	//							Internal Pub/Sub
	/*************************************************************************/

	ColorPicker.prototype.subscribe = function subscribe(topic, callback) {
		this.subscribers[topic] = callback;
	};

	ColorPicker.prototype.notify = function notify(topic, value) {
		if (this.subscribers[topic])
			this.subscribers[topic](value);
	};

	/*************************************************************************/
	//							Set Picker Properties
	/*************************************************************************/

	ColorPicker.prototype.setColor = function setColor(color) {
		if(color instanceof Color !== true) {
			console.log('Typeof parameter not Color');
			return;
		}

		if (color.format !== this.picker_mode) {
			color.setFormat(this.picker_mode);
			color.updateHSX();
		}

		this.color.copy(color);
		this.updateHuePicker();
		this.updatePickerPosition();
		this.updatePickerBackground();

		this.notify('red', this.color.r);
		this.notify('green', this.color.g);
		this.notify('blue', this.color.b);

		//console.log(this.color.r);
		this.notify('hue', this.color.hue);
		this.notify('saturation', this.color.saturation);
		this.notify('value', this.color.value);

		this.notify('alpha', this.color.a);
		this.notify('hexa', this.color.getHexa());
		notify(this.topic, this.color);
	};


	/*************************************************************************/
	//								UNUSED
	/*************************************************************************/


	var setColor = function setColor(topic, color) {
		if (pickers[topic])
			pickers[topic].setColor(color);
	};

	var getColor = function getColor(topic) {
		if (pickers[topic])
			return new Color(pickers[topic].color);
	};

	var subscribe = function subscribe(topic, callback) {
		if (subscribers[topic] === undefined)
			subscribers[topic] = [];

		subscribers[topic].push(callback);
	};



	var notify = function notify(topic, value) {
		if (subscribers[topic] === undefined || subscribers[topic].length === 0)
			return;

		var color = new Color(value);
		for (var i in subscribers[topic])
			subscribers[topic][i](color);
	};

	var init = function init() {
		var elem = document.querySelectorAll('.ui-color-picker');
		var size = elem.length;
		for (var i = 0; i < size; i++)
			new ColorPicker(elem[i]);
	};

	return {
		init : init,
		Color : Color,
		RGBColor : RGBColor,
		HSVColor : HSVColor,
		setColor : setColor,
		getColor : getColor,
		subscribe : subscribe
	};
})();