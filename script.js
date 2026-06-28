const form = document.getElementById('quoteForm');
const resultArea = document.getElementById('resultArea');
const downloadBtn = document.getElementById('download-pdf');
const whatsappBtn = document.getElementById('whatsapp-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. Get Values
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const length = parseFloat(document.getElementById('L').value);
    const width = parseFloat(document.getElementById('W').value);

    // 2. Calculation (Math Automation)
    const areaM2 = (length * 0.3048) * (width * 0.3048);
    const totalPrice = (areaM2 * 100).toFixed(2);
    const formattedArea = areaM2.toFixed(2);

    // 3. Save to Google Sheets (Automation)
    fetch("https://sheetdb.io/api/v1/ylxdpmik5nzpg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [{ name, phone, area: formattedArea, price: totalPrice, date: new Date().toLocaleDateString() }] })
    }).then(() => console.log("Saved to Google Sheet"));

    // 4. Show Results on the Screen
    document.getElementById('displayPrice').innerText = "Total Quote: $" + totalPrice;
    resultArea.style.display = "block";

    // 5. PDF Generation Logic
    downloadBtn.onclick = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("OFFICIAL QUOTATION", 105, 20, { align: "center" });
        doc.text(`Customer: ${name}`, 20, 40);
        doc.text(`Area: ${formattedArea} m2`, 20, 50);
        doc.text(`Total Price: $${totalPrice}`, 20, 70);
        doc.save(`Quote_${name}.pdf`);
    };

    // 6. WHATSAPP AUTOMATION LOGIC
    whatsappBtn.onclick = function() {
        // Your number formatted for WhatsApp: 923000417883
        const myNumber = "923000417883"; 
        
        const message = `*NEW QUOTATION*%0A` +
                        `-----------------------%0A` +
                        `*Customer:* ${name}%0A` +
                        `*Area:* ${formattedArea} m2%0A` +
                        `*Total Price:* $${totalPrice}%0A` +
                        `-----------------------%0A` +
                        `Please let us know if you want to proceed!`;
        
        // This opens the WhatsApp chat instantly
        window.open(`https://wa.me/${myNumber}?text=${message}`, "_blank");
    };
});
