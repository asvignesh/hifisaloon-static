/**
 * App Invoice List (jquery)
 */
var selectedStore = JSON.parse(storeName);
var selectedStoreName = selectedStore.value;
console.log(selectedStoreName);

'use strict';

$(function () {
  // Variable declaration for table
  var dt_invoice_table = $('.invoice-list-table');
  // Invoice datatable
  if (dt_invoice_table.length) {
    var dt_invoice = dt_invoice_table.DataTable({
      ajax: {
        url: baseUrl + 'stores/' + selectedStoreName + '/invoice/',
        method: "GET",
        headers: {
          "Authorization": "Bearer " + bearerToken
        },
        crossDomain: true,
        data: function(d) {
          console.log(d)
          let requestBody = {
            includeClient: 'y',
            page: ((d.start/d.length) + 1), 
            pageSize: d.length,
            sortBy: d.columns[d.order[0].column].name, 
            sortOrder: d.order[0].dir 
          };
          if (d.search.value.length==10) {
              requestBody.client = d.search.value;
          };
          return (requestBody);
        },
        dataSrc: function(json){
          console.log("Data: ",json);
          json.recordsTotal = json.totalCount;
          json.recordsFiltered = json.totalCount;
          json.data = json.data.filter((item) => (item.invoiceNumber != undefined && item.client != undefined))
          return json.data;
        },
        error: function (xhr, error, thrown) {
          if (xhr.status === 200 && xhr.responseJSON && xhr.responseJSON.data.length === 0) {
              alert("Invalid Phone Number");
          } else {
            alert("Invalid Phone Number");
          }
        }
      },
      processing: true,
      serverSide: true,
      columns: [
        // columns according to Data
        { data: '' },
        { data: 'invoiceNumber' },
        { data: 'invoiceNumber' },
        { data: 'client.name' },
        { data: 'netAmount' },
        { data: 'createdAt' },
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          responsivePriority: 2,
          searchable: false,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },

        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          render: function () {
            return '<input type="checkbox" class="dt-checkboxes form-check-input">';
          },
          checkboxes: {
            selectAllRender: '<input type="checkbox" class="form-check-input">'
          }
        },
        {
          // Invoice ID
          targets: 2,
          name: 'invoiceNumber',
          render: function (data, type, full, meta) {
            var $invoiceNumber = full['invoiceNumber'];
            // Creates full output for row
            //Karchange var $row_output = '<a href="invoice-preview.html"><span>#' + $invoiceNumber + '</span></a>';
            var $row_output = '<span>#' + $invoiceNumber + '</span></a>';
            return $row_output;
          }
        },
        {
          // Client name and Service
          targets: 3,
          responsivePriority: 4,
          name: 'client.name',
          render: function (data, type, full, meta) {
            var $name = full.client['name'],
              $mobile = full.client['mobile']
            // Creates full output for row
            var $row_output =
              '<div class="d-flex justify-content-start align-items-center">' +
              '<div class="d-flex flex-column gap-1">' +
              '<a href="pages-profile-user.html" class="text-truncate"><h6 class="mb-0">' +
              $name +
              '</h6></a>' +
              '<small class="text-truncate text-muted">' +
              $mobile +
              '</small>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          // Total Invoice Amount
          name: 'netAmount',
          targets: 4,
          render: function (data, type, full, meta) {
            var $total = full['netAmount'];
            return '<span class="d-none">' + $total + '</span>&#x20B9;' + $total.toFixed(2);
          }
        },
        {
          // Due Date
          name: 'createdAt',
          targets: 5,
          render: function (data, type, full, meta) {
            var $due_date = new Date(full['createdAt']);
            // Creates full output for row
            var $row_output =
              '<span class="d-none">' +
              moment($due_date).format('YYYYMMDD') +
              '</span>' +
              moment($due_date).format('DD MMM YYYY');
            $due_date;
            return $row_output;
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div class="d-flex align-items-center">' +
              // '<a href="javascript:;" data-bs-toggle="tooltip" class="text-body delete-record" data-bs-placement="top" title="Download Invoice"><i class="mdi mdi-cloud-download mdi-20px mx-1"></i></a>' +
              '<a href="invoice-preview.html?invoiceNumber=' + full['invoiceNumber']+ '" data-bs-toggle="tooltip" class="text-body" data-bs-placement="top" title="Preview Invoice"><i class="mdi mdi-eye-outline mdi-20px mx-1"></i></a>' +
              '<a href="invoice-edit.html?invoiceNumber=' + full['invoiceNumber']+ '" data-bs-toggle="tooltip" class="text-body" data-bs-placement="top" title="Edit Invoice"><i class="mdi mdi-lead-pencil mdi-20px mx-1"></i></a>' +
              '</div>'
            );
          }
        }
      ],
      order: [[2, 'desc']],
      dom:
        '<"row ms-2 me-3"' +
        '<"col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start gap-3"l<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start mt-md-0 mt-3"B>>' +
        '<"col-12 col-md-13 d-flex align-items-center justify-content-end flex-column flex-md-row pe-3 gap-md-3"f<"invoice_status mb-3 mb-md-0">>' +
        '>t' +
        '<"row mx-2"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: 'Show _MENU_',
        search: '',
        searchPlaceholder: 'Search Mobile#'
      },
      // Buttons with Dropdown
      buttons: [
        {
          text: '<i class="mdi mdi-plus me-md-1"></i><span class="d-md-inline-block d-none">Create Invoice</span>',
          className: 'btn btn-primary',
          action: function (e, dt, button, config) {
            window.location = 'invoice-add.html';
          }
        }
      ],
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['full_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      },
      initComplete: function () {
        // Adding role filter once table initialized
        this.api()
          .columns(8)
          .every(function () {
            var column = this;
            column
              .data()
              .unique()
              .sort();
          });
      }
    });
  }

  // On each datatable draw, initialize tooltip
  dt_invoice_table.on('draw.dt', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        boundary: document.body
      });
    });
  });

  // Delete Record
  $('.invoice-list-table tbody').on('click', '.delete-record', function () {
    // To hide tooltip on clicking delete icon
    $(this).closest($('[data-bs-toggle="tooltip"]').tooltip('hide'));
    // To delete the whole row
    dt_invoice.row($(this).parents('tr')).remove().draw();
  });
});
