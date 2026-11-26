import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import EventOutlined from "@mui/icons-material/EventOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import RequestQuoteOutlined from "@mui/icons-material/RequestQuoteOutlined";
import NextLink from "next/link";
import type { MessageResponse, ReferenceType } from "@/types/api";
import { answerBlocks, boldParts } from "../answer-blocks";
import { readReferences, referenceHref } from "../references";

const ICONS: Record<ReferenceType, React.ReactElement> = {
  OBLIGATION: <EventOutlined fontSize="small" />,
  INVOICE: <RequestQuoteOutlined fontSize="small" />,
  SERVICE: <ReceiptLongOutlined fontSize="small" />,
  DOCUMENT: <DescriptionOutlined fontSize="small" />,
};

function Rich({ text }: { text: string }) {
  return boldParts(text).map((part, i) => (part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>));
}

/** La pregunta va en una burbuja a la derecha; la respuesta, a todo el ancho y con sus registros como links. */
export function ChatMessage({ message }: { message: MessageResponse }) {
  if (message.role === "USER") {
    return (
      <Box className="chat-enter" sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography
          sx={{
            maxWidth: "80%",
            px: 2,
            py: 1.25,
            borderRadius: 3,
            borderBottomRightRadius: 6,
            bgcolor: "action.selected",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
          }}
        >
          {message.content}
        </Typography>
      </Box>
    );
  }
  const references = readReferences(message.metadata);
  return (
    <Box className="chat-enter" sx={{ maxWidth: "65ch", "& p, & ul": { my: 0.75 }, "& ul": { pl: 2.5 } }}>
      {answerBlocks(message.content).map((block, i) =>
        block.kind === "text" ? (
          <Typography key={i} component="p" className="tabular-nums">
            <Rich text={block.text} />
          </Typography>
        ) : (
          <Box key={i} component="ul" className="tabular-nums">
            {block.items.map((item, j) => (
              <Typography key={j} component="li">
                <Rich text={item} />
              </Typography>
            ))}
          </Box>
        ),
      )}
      {references.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
          {references.map((reference, i) => (
            <Chip
              key={reference.id}
              className="chat-chip"
              style={{ animationDelay: `${i * 40}ms` }}
              component={NextLink}
              href={referenceHref(reference)}
              clickable
              variant="outlined"
              size="small"
              icon={ICONS[reference.type]}
              label={reference.label}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
