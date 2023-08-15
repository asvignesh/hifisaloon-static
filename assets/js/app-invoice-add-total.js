$(document).ready(function () {
    var date = moment();
    var currentDate = date.format('DD-MM-YYYY HH:mm');
    $('.invoice-date').text(`Date: ${currentDate}`)
    
    $('table.main').on('mouseup keyup change', 'input[type=number]', () => calculateTotals());
    $('table.main').on('change', 'select#discount', () => calculateTotals());
    $('.btn-add-row').on('click', () => {
        const $lastRow = $('.item:last');
        const $newRow = $lastRow.clone();
        $newRow.find('input.invoice-item-qty').val(1);
        $newRow.find('input.invoice-item-rate').val(0).attr("placeholder", "00");
        // $newRow.find('input.stylist-service-charge').val(0).attr("placeholder", "00");
        $newRow.find('td.subtotal1').text('0.00');
        // $newRow.find('td.subtotal2').text('0.00');
        $newRow.insertAfter($lastRow);

        $newRow.find('input:first').focus();
    });

    $('table.main').on('click', '.btn-delete-row', function () {
        console.log('Delete Item')
        if($('.item').length > 1) {
            $(this).closest("tr.item").remove();
            calculateTotals();
        }
    });

    function calculateTotals() {
        const subtotals = $('.item').map((idx, val) => calculateSubtotal(val)).get();
        const subTotal = subtotals.reduce((a, v) => a + Number(v), 0);
        // const gst = $('#gst').val();
        const discount = $('#discount').val();
        let disc = 0
        switch(discount) {
            case 'STORE50':
                disc = 5
                break;
            case 'STORE75':
                disc = 7.5
                break;
            case 'STORE100':
                disc = 10
                break;
            case 'STORE125':
                disc = 12.5
                break;
            case 'STORE150':
                disc = 15
                break;
            default:
                disc = 0
        }
        // const discountedTotal = subTotal - (subTotal * (disc / 100));
        // const total = (discountedTotal * (gst / 100)) + discountedTotal
        // const total = discountedTotal
        $('.subTotal td:eq(1)').text(formatAsCurrency(subTotal.toFixed(2)));
        // $('.total td:eq(1)').text(formatAsCurrency(total.toFixed(2)));
    }

    function calculateSubtotal(row) {
        const $row = $(row);
        const itemQty = $row.find('input.invoice-item-qty').val();
        const itemRate = $row.find('input.invoice-item-rate').val();
        // const stylistCharge = $row.find('input.stylist-service-charge').val();
        const inputItemRate = itemRate ? itemRate : 0
        // const inputStylistCharge = stylistCharge ? stylistCharge : 0
        let subtotal = (itemQty * inputItemRate);
        // const subtotal1 = subtotal + parseInt(inputStylistCharge)
        $row.find('td.subtotal1').text(formatAsCurrency(subtotal));
        // $row.find('td.subtotal2').text(formatAsCurrency(inputStylistCharge));

        return subtotal;
    }

    function formatAsCurrency(amount) {
        return `${Number(amount).toFixed(2)}`;
    }
});