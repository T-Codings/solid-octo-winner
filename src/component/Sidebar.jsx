// ChatSidebar.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dummyContacts = [
  {
    id: 1,
    name: "Liam Anderson",
    image: "src/assets/App. jsx.jpg",
    lastMessage: "Hey, are you there?",
    typing: true,
    lastMessageTime: "04:50 PM",
    unread: 0,
    pinned: true,
  },
  {
    id: 2,
    name: "Lucas Williams",
    image: "src/assets/Lucas.png",
    lastMessage: "Hey, how's it going?",
    typing: false,
    lastMessageTime: "10:30 AM",
    unread: 2,
    pinned: true,
  },
  {
    id: 3,
    name: "Grace Miller",
    image: "src/assets/Ellipse.png",
    lastMessage: "Cant't wait for the weekend!",
    typing: false,
    lastMessageTime: "10:25 AM",
    unread: 0,
    pinned: true,
  },
  {
    id: 4,
    name: "Sophia Chen",
    image: "src/assets/invisibility icon.png",
    lastMessage: "Remember that concert last y...",
    typing: false,
    lastMessageTime: "07:23 AM",
    unread: 0,
    pinned: false,
  },
  {
    id: 5,
    name: "Benjamin Knight",
    image: "src/assets/github profile.jpg",
    lastMessage: "Just got back from a hiking trip!",
    typing: false,
    lastMessageTime: "08:45 PM",
    unread: 1,
    pinned: false,
  },
  {
    id: 6,
    name: "Olivia Foster",
    image: "src/assets/Orralearn.png",
    lastMessage: "Excited for the upcoming vac...",
    typing: false,
    lastMessageTime: "Yesterday",
    unread: 0,
    pinned: false,
  },
  {
    id: 7,
    name: "Jackson Adams",
    image: "src/assets/dove.jpg",
    lastMessage: "Looking forward to the weekend...",
    typing: false,
    lastMessageTime: "Yesterday",
    unread: 0,
    pinned: false,
  },
  {
    id: 8,
    name: "Ethan Sullivan",
    image: "src/assets/Naija-student.jpg",
    lastMessage: "Finished reading a captivating no...",
    typing: false,
    lastMessageTime: "Yesterday",
    unread: 0,
    pinned: false,
  },
];

function Sidebar() {
  const [contacts] = useState(dummyContacts);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openChat = (contact) => {
    navigate("/dashboard", { state: { contact } });
  };

  const pinnedContacts = filteredContacts.filter((c) => c.pinned);
  const otherContacts = filteredContacts.filter((c) => !c.pinned);

  // CONTACT ITEM
  const ContactItem = ({ contact }) => (
    <div
      key={contact.id}
      onClick={() => openChat(contact)}
      className="flex items-center gap-3 p-3
       cursor-pointer transition bg-white 
       hover:bg-green-100"
    >
      {/* Profile Image */}
      <img
        src={contact.image}
        alt={contact.name}
        className="w-12 h-12 -ml-2 rounded-full object-cover"
      />

      {/* Name + Message */}
      <div className="flex-1">
        <p className="font-semibold text-gray-800 text-sm mr-2">
          {contact.name}
        </p>

        <p className="text-xs text-gray-500 truncate">
          {contact.typing ? (
            <span className="text-indigo-500 animate-pulse">Typing...</span>
          ) : (
            contact.lastMessage
          )}
        </p>
      </div>

      {/* Time + Unread */}
      <div
        className="
        flex flex-col items-end 
        min-w-[50px] 
        sm:min-w-[60px]
        text-right
      "
      >
        <p
          className="
          text-[10px] sm:text-xs 
          text-gray-400 
          whitespace-nowrap 
          overflow-hidden 
          text-ellipsis
          max-w-[55px] sm:max-w-none
        "
        >
          {contact.lastMessageTime}
        </p>

        {contact.unread > 0 && (
          <span
            className="
            bg-[#49BCF9] 
            text-white 
            text-[10px] sm:text-xs 
            px-2 py-[2px] 
            rounded-full 
            mt-1
          "
          >
            {contact.unread}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-120 h-screen bg-white border ml-1 border-gray-200 rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <img src="src/assets/mingcutechat.png" className="w-6 h-6" />
        <img src="src/assets/Chatties.png" className="w-14" />
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="flex items-center relative">
          <Search className="absolute left-2 w-5 h-5 text-gray-500" />

          <input
            type="text"
            placeholder="Search messages, people"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 pl-8 pr-3 py-2 rounded border border-gray-300 text-gray-700 outline-none"
          />

          <img
            src="src/assets/Createnewchat.png"
            alt="Create"
            className="w-6 h-6 ml-2 cursor-pointer"
          />
        </div>
      </div>

      {/* Pinned Section */}
      {pinnedContacts.length > 0 && (
        <>
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center gap-1">
            <img src="src/assets/tablerpinfilled.png" className="w-4 h-4" />
            PINNED CHATS
          </h3>

          {pinnedContacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </>
      )}

      {/* All Contacts */}
      {otherContacts.length > 0 && (
        <>
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 flex items-center gap-1">
            <img src="src/assets/solidmessage.png" className="w-4 h-4" />
            ALL CHATS
          </h3>

          {otherContacts.map((contact) => (
            <ContactItem key={contact.id} contact={contact} />
          ))}
        </>
      )}

      {/* Empty */}
      {filteredContacts.length === 0 && (
        <p className="text-center py-6 text-gray-500">No contacts found.</p>
      )}
    </div>
  );
}

export default Sidebar;
