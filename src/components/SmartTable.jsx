import React from "react";
import { Col, Form } from "react-bootstrap";
import "../css/Footer.css";
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
  ], // A numeric array is also available. the purpose of above example is custom the text
};

export default function SmartTable(props) {
  const {
    data,
    columns,
    eventList,
    eventOnChangeCallback,
    hasButton = false,
  } = props;

  return (
    <ToolkitProvider keyField="id" data={data} columns={columns} search>
      {(props2) => (
        <PaginationProvider
          pagination={paginationFactory({ ...options, dataSize: data.length })}
        >
          {({ paginationProps, paginationTableProps }) => (
            <>
              <Form.Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label htmlFor="form-scan-event">
                      <FontAwesomeIcon icon="calendar-day" /> 活動
                    </Form.Label>
                    <Form.Control
                      as="select"
                      id="form-scan-event"
                      defaultValue="0"
                      onChange={(e) => {
                        eventOnChangeCallback(e.target.value);
                      }}
                    >
                      <option value="0" disabled>
                        請選擇活動
                      </option>
                      {eventList.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={{ span: 4, offset: 4 }}>
                  <Form.Group>
                    <Form.Label htmlFor="form-register-name">
                      <FontAwesomeIcon icon="search" /> 搜尋
                    </Form.Label>
                    {/* eslint-disable-next-line react/prop-types,react/jsx-props-no-spreading */}
                    <SearchBar {...props2.searchProps} />
                  </Form.Group>
                </Col>
              </Form.Row>
              {/* eslint-disable react/prop-types, react/jsx-props-no-spreading */}
              <Form.Row>
                <Col>
                  <BootstrapTable
                    search
                    wrapperClasses="table-responsive"
                    rowClasses={`text-nowrap ${hasButton && "has-button"}`}
                    bootstrap4
                    striped
                    hover
                    expandRow={undefined}
                    pagination={paginationFactory(options)}
                    {...props2.baseProps}
                    {...paginationTableProps}
                  />
                </Col>
              </Form.Row>
              <Form.Row className="react-bootstrap-table-footer">
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
              </Form.Row>
              {/* eslint-enable react/prop-types, react/jsx-props-no-spreading */}
            </>
          )}
        </PaginationProvider>
      )}
    </ToolkitProvider>
  );
}

SmartTable.propTypes = {
  content: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  eventList: PropTypes.array.isRequired,
  eventOnChangeCallback: PropTypes.func.isRequired,
  hasButton: PropTypes.bool.isRequired,
};
