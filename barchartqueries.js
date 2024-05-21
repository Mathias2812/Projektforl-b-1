const getmwiOutliers = (request, response) => {
    pool.query(
      "Select  Country_name, mwi_valueFROM Country ORDER BY mwi_value DESC LIMIT 5;",
      (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };