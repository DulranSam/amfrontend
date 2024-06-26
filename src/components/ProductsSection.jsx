/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { UserContext } from "@/App";

function ProductsSection() {
  const { loading, setLoading, BASE, status, setStatus } =
    useContext(UserContext);
  const [data, setData] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedProductType, setSelectedProductType] = useState("all");
  const [visibleCards, setVisibleCards] = useState(12); // Initially show 12 cards
  const navigate = useNavigate();

  async function fetchContent() {
    try {
      setLoading(true);
      const response = await Axios.get(
        `${BASE}/mains?type=${selectedType}&productType=${selectedProductType}`
      );
      if (response.status === 200) {
        setData(response.data);
      } else if (response.status === 404) {
        setStatus("No results found");
      } else {
        setStatus("Error!");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error!");
    } finally {
      setLoading(false);
    }
  }

  let differentProducts = false;

  useEffect(() => {
    fetchContent();
  }, [selectedType, selectedProductType]);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleProductTypeChange = (e) => {
    setSelectedProductType(e.target.value);
  };

  const handleSeeMore = () => {
    setVisibleCards((prev) => prev + 12); // Show 12 more cards
  };

  return (
    <section
      className="lg:px-24 py-12 flex justify-center items-start"
      id="products"
      style={{ color: "white" }}
    >
      {loading && <h1 style={{ color: "white" }}>Loading...</h1>}
      <div className="container flex flex-col">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-start text-white text-3xl font-bold">Products</h1>
          <div className="flex justify-between items-center gap-4">
            <select
              value={selectedType}
              className="p-2 rounded-lg bg-slate-900 border border-border text-white"
              onChange={handleTypeChange}
            >
              <option value="all">All</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="health">Health</option>
              <option value="travel">Travel</option>
              <option value="home">Home</option>
              <option value="outdoors">Outdoors</option>
            </select>
            {differentProducts && (
              <select
                value={selectedProductType}
                className="p-2 rounded-lg bg-slate-900 border border-border text-white"
                onChange={handleProductTypeChange}
              >
                <option value="all">All</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 gap-x-6 mt-5">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {Array.isArray(data) && data.length > 0 ? (
                data
                  .slice(0, visibleCards) // Limit to visibleCards
                  .map((item) => (
                    <Link to={`/product/${item._id}`} key={item._id}>
                      {item?.selectedProductType && (differentProducts = true)}
                      <div
                        key={item._id}
                        className="flex flex-col justify-between gap-6 items-center border border-border p-5 rounded-xl hover:scale-105 transition-all"
                      >
                        {item.mediaType === "photo" ? (
                          <img
                            src={item.mediaUrl}
                            alt={`Image of ${item.title}`}
                          ></img>
                        ) : (
                          <video
                            width="320"
                            height="240"
                            controls
                            className="rounded-xl hover:opacity-70 transition-all "
                          >
                            <source src={item.mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}

                        <div className="flex justify-between items-center w-full">
                          <div>
                            <h1 className="text-white font-bold text-lg">
                              {item.title}
                            </h1>
                            <h3 className="text-muted mt-3 text-sm">
                              Commission: {item.commission}% / sale
                            </h3>
                          </div>

                          <div className="flex flex-col justify-between items-end">
                            <p className="text-white p-1 bg-primary-foreground rounded-xl text-xs px-2">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <h1>{status}</h1>
              )}
            </>
          )}
        </div>

        {data.length > visibleCards && (
          <div className="flex justify-center mt-4">
            <button
              className="text-white hover:text-muted transition-all"
              onClick={handleSeeMore}
            >
              See More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;
