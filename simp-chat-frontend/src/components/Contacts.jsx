function Contacts({ contacts, currentUser, changeContact }) {
  const changeCurrentContact = (index, contact) => {
    changeContact(contact);
  };

  return (
    <div class="contact-card-container">
      {contacts.map((contact, index) => {
        return (
          <div
            onClick={() => changeCurrentContact(index, contact)}
            key={index}
            class="contact-card"
          >
            <div class="contact-profile-img">
              <img
                src={contact.profileImage.url}
                alt="Profile"
                className="contact-profiles"
              />
            </div>
            <div class="contact-details">
              <h3>
                {contact.firstName} {contact.lastName}
              </h3>
              <p>{contact.userName}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Contacts;
