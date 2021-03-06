import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [images, setImages] = useState([])

  useEffect(() => { 
    const requestImages = async () => {
      await axios.get(`http://181.143.87.202:7052/next`)
        .then(res => {
          let images = res.data.urls
          createObjImages(images)
        })
        .catch(e => { console.log(e) })
    }
    requestImages() 
  }, [])

  const requestImages = async () => {
    await axios.get(`http://181.143.87.202:7052/next`)
      .then(res => {
        let images = res.data.urls
        createObjImages(images)
      })
      .catch(e => { console.log(e) })
  }

  const createObjImages = img => {
    const newData = []
    img.forEach((img, idx) => {
      let data = {
        src: img,
        id_img: idx,
        positive: true,
      }
      newData.push(data)
    })
    setImages(newData)
  }

  const renderGallery = () => {
    return images.map((data, idx) => {
      const { positive, src } = data
      // const name = data.src.split('/').pop().split('-').shift()
      return (
        <div style={{ display: 'contents' }} key={`${src}_${idx}`}>
          <div className="mb-2 pl-4 w-25">
              <input
                type="checkbox"
                name={src}
                value={positive}
                checked={positive}
                onChange={e => handleChange(e, data.src)}
              />
              {/* <span>{`${name} ${idx}`}</span> */}
            <img className="img-fluid img-thumbnail" src={src} alt={src} />
          </div>
        </div>
      )
    })
  }

  const handleChange = (e, name_image) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    // actualizo un key de un objeto de un array
    setImages(prevState => {
      return prevState.map(data => data.src === name_image ? { ...data, positive: value } : data)
    })
  }

  const handleFormSubmit = async formSubmitEvent => {
    formSubmitEvent.preventDefault();
    const stateImages = [...images]
    const dataSend = []
    stateImages.forEach((img, idx) => {
      let data = {
        id: idx,
        url: img.src,
        positive: img.positive,
      }
      dataSend.push(data)
    })

    await axios.post('http://181.143.87.202:7052/next', dataSend)
    .then(res => {
      console.log('res en post', res)
      if (res.status === 200) {
        requestImages()
       }
    })
    .catch(err => console.log(err.status))
  };

  return (
    <div className="container">
      <h5 className="font-weight-light text-center mt-4 mb-0">¿Seleccione si esta imagen corresponde con los parametros seleccionados ?</h5>
      <hr />
      <form onSubmit={handleFormSubmit} className="row d-flex justify-content-between">
        {renderGallery()}
        <div className="my-4">
          <button
            type="submit"
            className="btn btn-success float-right"
          >
            next
          </button>
        </div>
      </form>
    </div>
  )
}

export default App