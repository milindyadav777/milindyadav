package examples;

import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class JvmMemoryLab implements AutoCloseable {
    private static final String SERVICE = "checkout";
    private static final Integer RETRY_LIMIT = Integer.valueOf(3);
    private static final ConcurrentMap<String, Receipt> RECEIPTS =
            new ConcurrentHashMap<>();
    private static final ThreadLocal<RequestContext> CONTEXT =
            new ThreadLocal<>();

    private final ExecutorService executor = Executors.newFixedThreadPool(2);

    public sealed interface Command permits Charge {}

    public record Charge(long orderId, BigDecimal amount) implements Command {
        public Charge {
            Objects.requireNonNull(amount, "amount");
            if (amount.signum() <= 0) {
                throw new IllegalArgumentException("amount must be positive");
            }
        }
    }

    public record Receipt(String key, BigDecimal amount, Instant createdAt) {}

    private record RequestContext(UUID traceId, ByteBuffer scratch) {}

    public CompletableFuture<Receipt> execute(Charge command) {
        Objects.requireNonNull(command, "command");

        return CompletableFuture.supplyAsync(() -> {
            RequestContext context = new RequestContext(
                    UUID.randomUUID(), ByteBuffer.allocateDirect(4_096));
            CONTEXT.set(context);

            try {
                String key = (SERVICE + ':' + command.orderId()).intern();
                int attempt = RETRY_LIMIT;
                context.scratch().putInt(attempt);

                Receipt receipt = new Receipt(
                        key, command.amount(), Instant.now());
                RECEIPTS.put(key, receipt);
                return receipt;
            } finally {
                CONTEXT.remove();
            }
        }, executor);
    }

    @Override
    public void close() {
        executor.shutdown();
    }

    public static void main(String[] args) {
        try (JvmMemoryLab lab = new JvmMemoryLab()) {
            Receipt receipt = lab.execute(
                    new Charge(42L, new BigDecimal("199.99"))).join();
            System.out.println(receipt);
        }
    }
}
