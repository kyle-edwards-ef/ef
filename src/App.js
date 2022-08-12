import "./App.css";
import seed from "./data/seedData.json";
import { useState, useEffect } from "react";

/*
  - Create a constant list [image, gallery, slider, banner]
  - Create an array [ID] called [eagerComponents] max length === 3
  - Create an array [ID] called [lazyComponents]
  - Traverse nested json for [{}] with img in constant imgList 
  - Iterate over  eager and lazy components
 */

/// init image components list
const imageComponentsList = ["image", "gallery", "slider", "banner"];

const maxEagerImages = 3;

/// utility function to check if any el has an img
function hasImage(arr) {
  return arr.some((b) => imageComponentsList.includes(b.component));
}

function App() {
  let [pageData, setPageData] = useState({});
  let [pageImgComps, setPageImgComps] = useState([]);
  let [eagerComponents, setEagerComponents] = useState([]);
  let [lazyComponents, setLazyComponents] = useState([]);

  /// init seed data
  useEffect(() => {
    setPageData(seed);
    let allComponents = seed.content.map((c) => c);

    /// init image containing components
    let imgComps = [];

    /// iterate over each component in content
    /// for each block -> search imageArr -> update img comps length
    /// DFS --> recursive?
    for (let component of allComponents) {
      /// Iterate over components keys and values
      for (const [_, subArr] of Object.entries(component)) {
        if (Array.isArray(subArr)) {
          if (hasImage(subArr)) {
            imgComps.push(component);
          } else {
            /// handle nested fragment bloks
            let fb = subArr.find((a) => a["fragmentBloks"]);
            /// handle img in fragment bloks
            if (fb) {
              if (hasImage(fb.fragmentBloks)) {
                imgComps.push(component);
              }
            }
          }
        }
      }
    }
    setPageImgComps(imgComps);
    return () => {};
  }, []);

  /// simulate lazy loaded components
  useEffect(() => {
    setEagerComponents(pageImgComps.slice(0, maxEagerImages));
    setTimeout(() => {
      setLazyComponents(pageImgComps.slice(maxEagerImages));
    }, 1200);
    console.count();
    return () => {};
  }, [pageImgComps]);

  return (
    <div className="App">
      <h1>
        This page has {pageData.content && pageData.content.length} top level
        components
      </h1>

      <h2>Eager Image Components</h2>
      <div>
        {eagerComponents.length &&
          eagerComponents.map((ec) => {
            return (
              <div key={ec.id} className="column">
                <p>{ec.component}</p>
                <p>{ec.id}</p>
                <hr />
              </div>
            );
          })}
      </div>

      <h2>Lazy Image Components</h2>
      <div>
        {lazyComponents.length ? (
          lazyComponents.map((lc) => {
            return (
              <div key={lc.id} className="column">
                <p>{lc.component}</p>
                <p>{lc.id}</p>
                <hr />
              </div>
            );
          })
        ) : (
          <p>-</p>
        )}
      </div>
    </div>
  );
}

export default App;
