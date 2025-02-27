import {Module} from "./ModuleRunner";
import {getBuffers} from "./util";
import {Selector} from "./Selector";
import {Style} from "./Style";

/**
 * Minimize Large Headers on Buffers
 */
export class HeaderMinimizer implements Module {
	private minByDefault;
	private tag = "pb-min-headers";
	
	constructor(minByDefault)
	{
		this.minByDefault = minByDefault;
	}
	
    cleanup() {
      // Nothing to clean up.
	  return;
    }
    run() {
		var buffers = getBuffers("CX ");
		if(!buffers){return;}
		
		buffers.forEach(buffer => {
			minimizeHeaders(buffer, this.minByDefault, this.tag);
		});
		
		var buffers = getBuffers("CONT ");
		if(!buffers){return;}
		
		buffers.forEach(buffer => {
			minimizeHeaders(buffer, this.minByDefault, this.tag);
		});
		
		return;
    }
  
}

function minimizeHeaders(buffer, minByDefault, tag)
{
	const bufferPanel = buffer.querySelector(Selector.BufferPanel);
	if(!bufferPanel || !bufferPanel.firstChild){return;}
	const headers = buffer.querySelectorAll(Selector.HeaderRow);
	if(headers[0] && headers[0].classList.contains(tag)){return;}
	if(minByDefault)
	{
		(Array.from(headers) as HTMLElement[]).forEach(header => {
			if(!header.classList.contains(tag))
			{
				header.style.display = "none";
			}
		});
	}
	const minimizeButton = document.createElement("div");
	minimizeButton.textContent = minByDefault ? "+" : "-";
	minimizeButton.classList.add("pb-minimize");
	minimizeButton.addEventListener("click", function(){
		const minimize = minimizeButton.textContent == "-";
		minimizeButton.textContent = minimize ? "+" : "-";
		(Array.from(headers) as HTMLElement[]).forEach(header => {
			if(!header.classList.contains(tag))
			{
				header.style.display = minimize ? "none" : "flex";
			}
			return;
		});
		return;
	});
	
	bufferPanel.firstChild.insertBefore(createHeaderRow("Minimize", minimizeButton, tag), bufferPanel.firstChild.firstChild);
	return;
}

// Move to util eventually, maybe
function createHeaderRow(labelText: string, rightSideContents: Element, tag: string)
{
	const row = document.createElement("div");
	row.classList.add(...Style.HeaderRow);
	row.classList.add(tag);
	const label = document.createElement("label");
	label.classList.add(...Style.HeaderLabel);
	label.textContent = labelText;
	row.appendChild(label);
	const content = document.createElement("div");
	content.classList.add(...Style.HeaderContent);
	
	const rightSideDiv = document.createElement("div");
	rightSideDiv.appendChild(rightSideContents);
	content.appendChild(rightSideDiv);
	row.appendChild(content);
	return row;
}