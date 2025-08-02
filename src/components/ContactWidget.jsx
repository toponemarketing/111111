import React, { useEffect, useRef } from 'react'

const ContactWidget = ({ className = "" }) => {
  const widgetRef = useRef(null)

  useEffect(() => {
    // Remove any existing scripts
    const existingScripts = document.querySelectorAll('script[src*="simplepractice"]')
    existingScripts.forEach(script => script.remove())

    // Create and inject the widget HTML
    if (widgetRef.current) {
      widgetRef.current.innerHTML = `
        <style>
          .spwidget-button-wrapper{text-align: center}
          .spwidget-button{display: inline-block;padding: 12px 24px;color: #fff !important;background: #9333ea;border: 0;border-radius: 8px;font-size: 16px;font-weight: 600;text-decoration: none;transition: all 0.2s ease;}
          .spwidget-button:hover{background: #7c3aed;transform: translateY(-1px);box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);}
          .spwidget-button:active{color: rgba(255, 255, 255, .75) !important;box-shadow: 0 1px 3px rgba(0, 0, 0, .15) inset;transform: translateY(0);}
        </style>
        <div class="spwidget-button-wrapper">
          <a href="https://boundless.clientsecure.me" class="spwidget-button" data-spwidget-scope-id="9b9688f4-a406-445b-8cf3-d0dff6dd4101" data-spwidget-scope-uri="boundless" data-spwidget-application-id="7c72cb9f9a9b913654bb89d6c7b4e71a77911b30192051da35384b4d0c6d505b" data-spwidget-channel="embedded_widget" data-spwidget-scope-global data-spwidget-autobind data-spwidget-contact>Contact</a>
        </div>
      `
    }

    // Load the SimplePractice script
    const script = document.createElement('script')
    script.src = 'https://widget-cdn.simplepractice.com/assets/integration-1.0.js'
    script.async = true
    script.onload = () => {
      console.log('SimplePractice contact widget script loaded')
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return <div ref={widgetRef} className={className}></div>
}

export default ContactWidget
