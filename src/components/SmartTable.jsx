import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
  PaginationTotalStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BootstrapTable from "react-bootstrap-table-next";
import PropTypes from "prop-types";

const { SearchBar } = Search;

const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
    顯示第 {from} 到第 {to} 項記錄，總共 {size} 項記錄
  </span>
);

const options = {
  custom: true,
  // paginationSize: 4,
  pageStartIndex: 1,
  showTotal: true,
  paginationTotalRenderer: customTotal,
  disablePageTitle: true,
  sizePerPageList: [
    {
      text: "10",
      value: 10,
    },
    {
      text: "25",
      value: 25,
    },
    {
      text: "50",
      value: 50,
    },
    {
      text: "100",
      value: 100,
    },
  ],
};

export default function SmartTable(props) {
  const { data, columns, hasButton = false } = props;

  return (
    <ToolkitProvider
      keyField="id"
      data={data}
      columns={columns}
      search={{ searchFormatted: true }}
    >
      {(props2) => (
        <PaginationProvider
          pagination={paginationFactory({
            ...options,
            dataSize: data.length,
          })}
        >
          {({ paginationProps, paginationTableProps }) => (
            <>
              <Row>
                <Col md={{ span: 4, offset: 8 }}>
                  <Form.Group>
                    <Form.Label htmlFor="form-register-name">
                      <FontAwesomeIcon icon="search" /> 搜尋
                    </Form.Label>
                    {/* eslint-disable-next-line react/prop-types,react/jsx-props-no-spreading */}
                    <SearchBar {...props2.searchProps} />
                  </Form.Group>
                </Col>
              </Row>
              {/* eslint-disable react/prop-types, react/jsx-props-no-spreading */}
              <Row>
                <Col>
                  <BootstrapTable
                    search
                    wrapperClasses="table-responsive text-nowrap"
                    rowClasses={`${hasButton && "has-button"}`}
                    bootstrap4
                    striped
                    hover
                    expandRow={undefined}
                    pagination={paginationFactory(options)}
                    {...props2.baseProps}
                    {...paginationTableProps}
                  />
                </Col>
              </Row>
              <Row className="react-bootstrap-table-footer">
                <Col md={4}>
                  <PaginationTotalStandalone {...paginationProps} />
                </Col>
                <Col md={4}>
                  每頁顯示&nbsp;&nbsp;
                  <SizePerPageDropdownStandalone {...paginationProps} />
                  &nbsp;&nbsp;筆資料
                </Col>
                <Col md={4}>
                  <PaginationListStandalone {...paginationProps} />
                </Col>
              </Row>
              {/* eslint-enable react/prop-types, react/jsx-props-no-spreading */}
            </>
          )}
        </PaginationProvider>
      )}
    </ToolkitProvider>
  );
}

SmartTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  hasButton: PropTypes.bool.isRequired,
};
