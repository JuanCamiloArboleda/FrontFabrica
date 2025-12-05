// Script para convertir un PDF a base64 en Node.js
const fs = require('fs');
const path = require('path');

const pdfPath = path.resolve(__dirname, '../../../Downloads/ExamenFinal2025-2.pdf');
const pdfData = fs.readFileSync(pdfPath);
const base64 = pdfData.toString('base64');

console.log('data:application/pdf;base64,' + base64);