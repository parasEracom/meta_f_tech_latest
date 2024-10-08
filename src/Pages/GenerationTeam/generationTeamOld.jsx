import React, { useEffect, useState, useCallback } from "react";
import { MdOutlineFilterList } from "react-icons/md";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { ApiPaths } from "../../Config/ApiPath";
import Loader from "./../../Components/Loader/Loader";
import { GrNext, GrPrevious } from "react-icons/gr";
import "./GenerationTeam.css";
import { Data } from "../../Common/Data";
import Change from "./../../Common/StringToSub";
import PaginationComponent from "../../Components/PaginationControls/PaginationControls";
import useAxiosHelper from "../../Common/AxiosHelper";
import { BasicInfo } from "../../Config/BasicInfo";
import { toast } from "react-toastify";
import moment from "moment";
import debounce from "lodash.debounce";

const GenerationTeam = () => {
  const [selectLevel, setSelectLevel] = useState([]);
  const [filterVisibility, setFilterVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [limitFilter, setLimitFilter] = useState(20);
  const [dateFilter, setDateFilter] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [generationTeam, setGenerationTeam] = useState([]);
  const [level, setLevel] = useState("All");
  const [levelNumber, setLevelNumber] = useState("All");
  const [allDataTotals, setAllDataTotals] = useState({ totalSelfBusiness: 0, totalTeamBusiness: 0 });
  const { AxiosGet } = useAxiosHelper();
  const [companyData, setCompanyData] = useState();
  const [search, setSearch] = useState({
    username: "",
    name: "",
    self_investment: "",
    business: "",
    startDate: "",
    endDate: "",
  });

  // Fetch company data from local storage
  async function CompanyInfo() {
    try {
      const data = localStorage.getItem("companyData");
      setCompanyData(JSON.parse(data));
    } catch (error) {
      console.log(error);
    }
  }

  // Debounce function for search input changes
  const fetchTeams = useCallback(
    debounce((params) => {
      FetchData(params);
    }, 500),
    []
  );

  // Handle changes in search input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    } else {
      setSearch((prev) => {
        const updatedSearch = { ...prev, [name]: value };
        Object.keys(updatedSearch).forEach((key) => {
          if (updatedSearch[key] === "" || updatedSearch[key] === 0) {
            delete updatedSearch[key];
          }
        });
        return updatedSearch;
      });
    }
    fetchTeams({
      page: currentPage,
      limit: limitFilter,
      ...Object.fromEntries(
        Object.entries(search).filter(
          ([_, value]) => value !== "" && value !== 0
        )
      ),
      ...(startDate && endDate ? { startDate, endDate } : {}),
    });
  };

  // Handle date filter changes
  const handleDateFilterChange = (e) => {
    const value = e.target.value;
    setDateFilter(value);
    const today = moment().endOf("day");
    let start = "";
    let end = "";
    switch (value) {
      case "today":
        start = today.startOf("day").format("YYYY-MM-DD");
        end = today.format("YYYY-MM-DD");
        break;
      case "yesterday":
        start = today.subtract(1, "days").startOf("day").format("YYYY-MM-DD");
        end = today.endOf("day").format("YYYY-MM-DD");
        break;
      case "this_week":
        start = today.startOf("week").format("YYYY-MM-DD");
        end = today.endOf("week").format("YYYY-MM-DD");
        break;
      case "this_month":
        start = today.startOf("month").format("YYYY-MM-DD");
        end = today.endOf("month").format("YYYY-MM-DD");
        break;
      default:
        start = "";
        end = "";
        break;
    }
    setStartDate(start);
    setEndDate(end);
  };

  // Reset all filter data
  const resetData = () => {
    setSearch({
      username: "",
      name: "",
      self_investment: "",
      business: "",
      startDate: "",
      endDate: "",
      status: "1",
    });
    setLimitFilter(20);
    setStartDate("");
    setEndDate("");
    setDateFilter("default");
    setCurrentPage(1);
    FetchData(); // Fetch data with default parameters
  };

  // Handle limit change for pagination
  const handleLimitChange = (e) => {
    setLimitFilter(e.target.value);
  };

  // Fetch levels for dropdown
  const fetchIncome = (e) => {
    const selectedLevel = e.target.value;
    setLevel(selectedLevel);
    setLevelNumber(
      selectedLevel === "All" ? "All" : selectedLevel.split(" ")[1]
    );
  };

  // Handle pagination
  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  // Fetch levels from API
  const getLevels = async () => {
    try {
      const response = await AxiosGet(ApiPaths.getPackages);
      const levels = response?.packages?.[0]?.level_income?.level;
      setSelectLevel(levels);
    } catch (error) {
      BasicInfo.isDebug && console.error("Error fetching levels:", error);
    }
  };

  // Fetch data on component mount and level changes
  useEffect(() => {
    getLevels();
  }, []);

  useEffect(() => {
    FetchData();
    CompanyInfo();
    fetchAllDataTotals(); // Fetch the total business data for all pages when the level changes
  }, [levelNumber, currentPage]);

  // Fetch all data for the selected level and calculate totals
  const fetchAllDataTotals = async () => {
    try {
      const queryParams = {
        limit: 100000, // Large limit to get all records
        levels: levelNumber !== "All" ? levelNumber : undefined,
      };
      if (startDate && endDate) {
        queryParams.startDate = startDate;
        queryParams.endDate = endDate;
      }
      const response = await AxiosGet(
        `${ApiPaths.getALlTeam}?${new URLSearchParams(queryParams).toString()}`
      );
      const totalSelfBusiness = response?.data.reduce((sum, member) => sum + (member?.self_investment || 0), 0);
      const totalTeamBusiness = response?.data.reduce((sum, member) => sum + (member?.business || 0), 0);
      setAllDataTotals({ totalSelfBusiness, totalTeamBusiness });
    } catch (error) {
      BasicInfo.isDebug && console.error("Error fetching all data totals:", error);
    }
  };
  // const calculateTotals = (data) => {
  //   const totalSelfBusiness = data.reduce((sum, member) => sum + (member?.self_investment || 0), 0);
  //   const totalTeamBusiness = data.reduce((sum, member) => sum + (member?.business || 0), 0);
  //   return { totalSelfBusiness, totalTeamBusiness };
  // };
  // Fetch paginated data
  const FetchData = async () => {
    try {
      const queryParams = {
        page: currentPage,
        limit: limitFilter,
        ...Object.fromEntries(
          Object.entries(search).filter(
            ([_, value]) => value !== "" && value !== 0
          )
        ),
      };
      if (levelNumber !== "All") {
        queryParams.levels = levelNumber;
      }
      if (startDate && endDate) {
        queryParams.startDate = startDate;
        queryParams.endDate = endDate;
      }
      setLoading(true);
      const response = await AxiosGet(
        `${ApiPaths.getALlTeam}?${new URLSearchParams(queryParams).toString()}`
      );
      setGenerationTeam(response?.data);
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      BasicInfo.isDebug && console.error("Error fetching payment transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <section className="dashboard">
        <div className="incomeSelectBox">
          <select value={level} onChange={fetchIncome}>
            <option value="All">All Data</option>
            {Array.isArray(selectLevel) &&
              selectLevel.map((x, index) => (
                <option key={index} value={`Level ${index + 1}`}>
                  {`Level ${index + 1}`}
                </option>
              ))}
          </select>

          <button onClick={() => setFilterVisibility(!filterVisibility)}>
            {filterVisibility ? "Hide Filters" : "Show Filters"}
            <i>
              <MdOutlineFilterList />
            </i>
          </button>
        </div>
        {filterVisibility && (
          <section className="filtersection inputPrimary">
            <Row>
              <Col lg="2" md="4" xs="12">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={search.name}
                  onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <input
                  type="text"
                  name="self_investment"
                  placeholder="Self Business"
                  value={search.self_investment}
                  onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <input
                  type="text"
                  name="business"
                  placeholder="Team Business"
                  value={search.business}
                  onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <input
                  type="date"
                  name="endDate"
                  placeholder="End Date"
                  value={endDate}
                  onChange={handleChange}
                />
              </Col>
              <Col lg="2" md="4" xs="12">
                <div>
                  <select
                    name="dateFilter"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                  >
                    <option value="default">Default</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                  </select>
                </div>
              </Col>
              <Col lg="2" md="4" xs="12">
                <div>
                  <select
                    name=""
                    value={limitFilter}
                    onChange={handleLimitChange}
                  >
                    <option value="">--All--</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                  </select>
                </div>
              </Col>
              <Col lg="2" md="4" xs="6">
                <button onClick={resetData}>Reset</button>
              </Col>
            </Row>
          </section>
        )}
        <section className="history">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="textHeading">Generation Team</h1>
          </div>

          <div className="historyContent">
            <h1 className="textHeading"></h1>
            {levelNumber === "All" ? (
              <>
                {/* <h4>
                  Total Self Business (All Data): <span>{allDataTotals.totalSelfBusiness || 0} {companyData?.currency}</span>
                </h4>
                <h4>
                  Total Team Business (All Data): <span>{allDataTotals.totalTeamBusiness || 0} {companyData?.currency}</span>
                </h4> */}
              </>
            ) : (
              <div style={{ textAlign: "end" }}>
                <h4>
                  Self Business: <span>{allDataTotals.totalSelfBusiness || 0} {companyData?.currency}</span>
                </h4>
                <h4>
                  Team Business: <span>{allDataTotals.totalTeamBusiness || 0} {companyData?.currency}</span>
                </h4>
              </div>
            )}


          </div>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>User Id</th>
                  <th>Name</th>
                  <th>Join Date</th>
                  <th>Activation Date</th>
                  <th>Sponsor ID (Name)</th>
                  <th>Mobile Number</th>
                  <th>Self Business</th>
                  <th>Team Business</th>
                </tr>
              </thead>
              <tbody>
                {generationTeam?.map((x, i) => (
                  <tr key={i}>
                    <td>{i + 1 + limitFilter * (currentPage - 1)}</td>
                    <td>{x?.username}</td>
                    <td>{x?.name}</td>
                    <td>{new Date(x?.joining_date).toLocaleDateString()}</td>
                    <td>{new Date(x?.Activation_date).toLocaleDateString()}</td>
                    <td>
                      {x?.sponsor_username} ({x?.sponsor_name})
                    </td>
                    <td>{x.mobile}</td>
                    <td>{x?.self_investment}</td>
                    <td>{x?.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {generationTeam?.length === 0 && <p>No history yet</p>}
          </div>
          {generationTeam?.length > 0 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePagination}
            />
          )}
        </section>
      </section>
    </>
  );
};

export default GenerationTeam;



