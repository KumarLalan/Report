import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Assuming you have a corresponding CSS file
import html2pdf from 'html2pdf.js';

const Grid = () => {
  const todayDate = new Date().toLocaleDateString('en-GB');
  const [pageNumber, setPageNumber] = useState(localStorage.getItem('pageNumber') || '123367');
  const [fontSize, setFontSize] = useState(20);
  const containerRef = useRef(null);

  useEffect(() => {
    const textarea = document.getElementById('myTextarea');
    limitTextArea(textarea);
  }, [fontSize]);

  const limitTextArea = (textarea) => {
    textarea.addEventListener('input', function () {
      checkTextAreaFullness();
    });

    textarea.addEventListener('scroll', function () {
      checkTextAreaFullness();
    });

    function checkTextAreaFullness() {
      var container = textarea.parentElement;
      var maxHeight = container.clientHeight;

      setTimeout(function () {
        if (textarea.scrollHeight > maxHeight - 10) {
          textarea.value = textarea.value.slice(0, -50);
          textarea.blur();
        }
      }, 0);
    }
  };

  const generatePDF = () => {
    const allPages = document.querySelectorAll('.grid-container'); // Select all grid containers
    const clonedPages = Array.from(allPages).map((page) => {
      const clonedPage = page.cloneNode(true);

      // Add a class to the main container to include it in the PDF
      clonedPage.classList.add('pdf-container');

      const textareas = clonedPage.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        const replacementDiv = document.createElement('div');
        replacementDiv.textContent = textarea.value;
        replacementDiv.style.whiteSpace = 'pre-wrap';
        replacementDiv.style.fontFamily = 'hindi';
        replacementDiv.style.marginLeft = '10px';
        replacementDiv.style.textAlign = 'left';
        replacementDiv.style.fontSize = `${fontSize}px`;
        textarea.parentNode.replaceChild(replacementDiv, textarea);
      });

      // Adjust the styles of the cloned container for better rendering in PDF
      clonedPage.style.width = '21cm';
      clonedPage.style.height = '29.7cm';
      clonedPage.style.overflow = 'visible';
      clonedPage.style.position = 'relative';
      clonedPage.style.margin = '0';

      return clonedPage;
    });

    // Merge all cloned pages into a single container
    const mergedContainer = document.createElement('div');
    mergedContainer.classList.add('pdf-container');
    clonedPages.forEach((clonedPage) => {
      mergedContainer.appendChild(clonedPage);
    });

    html2pdf(mergedContainer);

    setPageNumber((prevNumber) => {
      const newNumber = parseInt(prevNumber) + 1;
      localStorage.setItem('pageNumber', newNumber.toString());
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      return newNumber.toString();
    });
  };
  const generateDefaultGridDesign = () => {
    const gridItems = [
      <div key='11' className='grid-item box-11'>
        <p>अनुसुची 47, प्रपत्र संo 120 अ <br /> आoहo प्रपत्र संo 30 अ </p>
      </div>,
      <div key='12' className='grid-item box-12'>
        <p>केस दैनिक संo <br /> ( नियम-164 )</p>
        <div className="ib">
          <input type="text" placeholder="" style={{ width: '100px' }} />
        </div>
      </div>,
      <div key='13' id="pageNumber" className='grid-item box-13'>
        {pageNumber}
      </div>,
      <div key='21' className='grid-item box-21'>
        <p></p>
      </div>,
      <div key='22' className='grid-item box-22'>
        <input type="text" placeholder="" style={{ width: '100px', fontFamily: 'hindi' }} />बनाम
        <input type="text" placeholder="" style={{ width: '100px', fontFamily: 'hindi' }} />
        <br /> विशेष रिपोर्ट केस संo
        <input type="text" placeholder="" style={{ width: '100px' }} />
      </div>,
      <div key='31' className='grid-item box-31'>
        <p>
          थाना <input type="text" placeholder="" style={{ width: '100px', fontFamily: 'hindi' }} />
          जिला<input type="text" placeholder="" style={{ width: '100px', fontFamily: 'hindi' }} />
          प्रथम इतिला रिपोर्ट संo<input type="text" placeholder="" style={{ width: '100px', fontFamily: 'hindi' }} />
          तिथि<input type="text" placeholder="" style={{ width: '100px' }} />
        </p>
        <p>
          घटना की तिथि और स्थान <input type="text" placeholder="" style={{ width: '300px', fontFamily: 'hindi' }} />
          धारा<input type="text" placeholder="" style={{ width: '200px', fontFamily: 'hindi' }} />
        </p>
      </div>,
      <div key='41' className='grid-item box-41'>
        किस तिथि को (समय सहित) करवाई की गई और किन-किन स्थानों को जाकर देखा गया
      </div>,
      <div key='42' className='grid-item box-42'>
        अन्वेषण का अभिलेख
      </div>,
      <div key='51' className='grid-item box-51'>
      <input
        type="text"
        id='date'
        placeholder={todayDate}
        style={{ width: '90%', border: 'none', fontSize: `${fontSize}px`, appearance: 'none' }}
      />
      <div className="reg">
        <textarea
          id="myarea"
          style={{ width: '90%', fontFamily: 'hindi', fontSize: `${fontSize}px`, border: 'none', outline: 'none', resize: 'none' }}
        ></textarea>
      </div>
    </div>,
    <div key='52' className='grid-item box-52'>
      <textarea
        id="myTextarea"
        onInput={() => limitTextArea(document.getElementById('myTextarea'))}
        maxLength="10000"
        style={{ fontSize: `${fontSize}px` }}
      ></textarea>
    </div>,
  ];

  return (
    <div className="grid-container">
      {gridItems}
    </div>
  );
};

  const generateCustomGridDesign = () => {
    const gridItems = [
      <div key='00' className='item box-00'>
      </div>,
      <div key='01' className='item box-01'>
         <textarea
          id="myTarea"
          onInput={() => limitTextArea(document.getElementById('myTarea'))}
          maxLength="9000"
          style={{ fontSize: `${fontSize}px` }}
        ></textarea>
      </div>,
    ];

    return (
      <div className="grid-container">
        {gridItems}
      </div>
    );
  };

  const [pages, setPages] = useState([{ key: 'default', design: generateDefaultGridDesign() }]);
  const addPage = () => {
    const newPageKey = `page-${pages.length + 1}`;
    const newDesign = generateCustomGridDesign(); // You can modify this function for different designs
    setPages((prevPages) => [...prevPages, { key: newPageKey, design: newDesign }]);
  };

  const renderPages = () => {
    return pages.map((page) => (
      <div key={page.key} className="page-container">
        {page.design}
      </div>
    ));
  };

  return (
    <div>
      {renderPages()}
      <div className='controls'>
        <div className='btn'>
          <button id='bt11' onClick={generatePDF}>Generate PDF</button>
          <button id='bt12' onClick={addPage}>Add Page</button>
        </div>
        
          <input
            type="range"
            id="fontSize"
            className='fontSize'
            name="fontSize"
            min="18"
            max="36"
            step="2"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          />
          <label className='fontSize' id='labelhai' htmlFor="fontSize">Font Size: {fontSize}px</label>
        </div>
      </div>

  );
};

export default Grid;

