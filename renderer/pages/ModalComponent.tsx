import { useState } from 'react'
import { css } from '@emotion/react'

type ModalProps = {
  buttonLabel: string
}

const ModalComponent = ({ buttonLabel }: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleModal = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* <button onClick={toggleModal} css={buttonStyle}> */}
      <button onClick={toggleModal}>
        {buttonLabel}
      </button>
      {isOpen && (
        // <div css={overlayStyle}>
        //   <div css={modalStyle}>
          <div>
          <div>
            <p>This is a modal window.</p>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}

// const buttonStyle = css`
//   /* Button styling */
// `

// const overlayStyle = css`
//   /* Overlay styling */
// `

// const modalStyle = css`
//   /* Modal window styling */
// `

export default ModalComponent