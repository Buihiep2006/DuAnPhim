const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'main', 'java', 'com', 'example', 'datvexemphim');

function cleanImportsInDir(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanImportsInDir(fullPath);
        } else if (fullPath.endsWith('.java')) {
            cleanFile(fullPath);
        }
    }
}

function cleanFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check usage of types
    const typesToCheck = [
        { type: 'LocalDate', importStr: 'import java.time.LocalDate;' },
        { type: 'LocalTime', importStr: 'import java.time.LocalTime;' },
        { type: 'LocalDateTime', importStr: 'import java.time.LocalDateTime;' },
        { type: 'BigDecimal', importStr: 'import java.math.BigDecimal;' },
        { type: 'ColumnDefault', importStr: 'import org.hibernate.annotations.ColumnDefault;' },
        { type: 'Nationalized', importStr: 'import org.hibernate.annotations.Nationalized;' }
    ];

    typesToCheck.forEach(t => {
        // Find how many times the type name occurs.
        const regex = new RegExp(`\\b${t.type}\\b`, 'g');
        const count = (content.match(regex) || []).length;
        // If it occurs exactly once, and the import is present, it means it's ONLY in the import, so remove it.
        // It could also occur 0 times if the user already removed the import but left blank lines.
        if (count <= 1 && content.includes(t.importStr)) {
            // we remove the line
            let lines = content.split('\n');
            lines = lines.filter(line => !line.includes(t.importStr));
            content = lines.join('\n');
        }
    });

    // If it's a request DTO, add validations
    if (filePath.includes(path.join('dto', 'request'))) {
        let hasValidation = content.includes('jakarta.validation.constraints');
        if (!hasValidation) {
            content = content.replace(
                'import lombok.Data;', 
                'import lombok.Data;\nimport jakarta.validation.constraints.NotBlank;\nimport jakarta.validation.constraints.NotNull;'
            );
        }
        
        let lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.match(/\s+private String \w+;/)) {
                // Look back to see if there's already @NotBlank
                if (i > 0 && !lines[i-1].includes('@NotBlank')) {
                    lines[i] = `    @NotBlank(message = "Không được để trống")\n` + line;
                }
            } else if (line.match(/\s+private (Integer|UUID|LocalDate|LocalTime|LocalDateTime|BigDecimal) \w+;/)) {
                // Look back
                if (i > 0 && !lines[i-1].includes('@NotNull')) {
                    lines[i] = `    @NotNull(message = "Không được để trống")\n` + line;
                }
            }
        }
        content = lines.join('\n');
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

cleanImportsInDir(srcDir);
console.log("Cleanup and validation updates complete!");
